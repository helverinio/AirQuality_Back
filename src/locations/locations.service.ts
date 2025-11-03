import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateLocationDto } from './create-location.dto';
import { UpdateLocationDto } from './update-location.dto';

@Injectable()
export class LocationsService {
  constructor(@InjectRepository(Location) private repo: Repository<Location>) {}

  async create(dto: CreateLocationDto) {
    try {
      if (!dto || !dto.locationName) {
        throw new BadRequestException('locationName is required');
      }

      const location = this.repo.create({
        locationName: dto.locationName,
        latitude: dto.latitude,
        longitude: dto.longitude
      });

      return await this.repo.save(location);
    } catch (error) {
      console.error('Error creating location:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create location. ' + error.message);
    }
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ locationID: id });
  }

  async update(id: number, dto: UpdateLocationDto) {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
