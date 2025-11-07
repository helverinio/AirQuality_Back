import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { CreateStationDto } from './create-station.dto';
import { UpdateStationDto } from './update-station.dto';

@Injectable()
export class StationsService {
  constructor(@InjectRepository(Station) private repo: Repository<Station>) {}

  async create(dto: CreateStationDto) {
    try {
      console.log('Service received DTO:', JSON.stringify(dto, null, 2));
      
      // Validar que el nombre de la estación esté presente
      if (!dto || !dto.stationName) {
        console.log('DTO validation failed - stationName is missing or null');
        throw new BadRequestException('Station name is required');
      }

      // Crear la entidad base
      const stationData = {
        stationName: dto.stationName.toString().trim() // Convertir a string y eliminar espacios
      };
      console.log('Creating station with data:', stationData);
      
      const station = this.repo.create(stationData);

      // Agregar relaciones si se proporcionan los IDs
      if (dto.locationID) {
        station.location = { locationID: dto.locationID } as any;
      }

      if (dto.pollutantID) {
        station.pollutant = { pollutantID: dto.pollutantID } as any;
      }



      return await this.repo.save(station);
    } catch (error) {
      console.error('Error creating station:', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Manejar errores específicos de la base de datos
      if (error.code === '23502') { // violación de no nulo
        throw new BadRequestException('Station name cannot be empty');
      }
      
      if (error.code === '23503') { // violación de clave foránea
        throw new BadRequestException('Invalid locationID or pollutantID');
      }
      
      throw new InternalServerErrorException('Failed to create station: ' + error.message);
    }
  }

  findAll() {
    return this.repo.find({ relations: ['location', 'pollutant'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { stationID: id }, relations: ['location', 'pollutant'] });
  }

  async update(id: number, dto: UpdateStationDto) {
    const toUpdate: any = {};
    if (dto.stationName) toUpdate.stationName = dto.stationName;
    if (dto.locationID !== undefined) toUpdate.location = dto.locationID ? { locationID: dto.locationID } : null;
    if (dto.pollutantID !== undefined) toUpdate.pollutant = dto.pollutantID ? { pollutantID: dto.pollutantID } : null;
    await this.repo.update(id, toUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
