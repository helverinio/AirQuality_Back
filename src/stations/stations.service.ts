import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { CreateStationDto } from './create-station.dto';
import { UpdateStationDto } from './update-station.dto';

@Injectable()
export class StationsService {
  constructor(@InjectRepository(Station) private repo: Repository<Station>) {}

  create(dto: CreateStationDto) {
    const e: any = this.repo.create({ stationName: dto.stationName });
    if (dto.locationID) e.location = { locationID: dto.locationID };
    if (dto.pollutantID) e.pollutant = { pollutantID: dto.pollutantID };
    return this.repo.save(e);
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
