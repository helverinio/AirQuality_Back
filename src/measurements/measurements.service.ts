import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirQualityMeasurement } from '../entities/air-quality-measurement.entity';
import { CreateMeasurementDto } from './create-measurement.dto';
import { UpdateMeasurementDto } from './update-measurement.dto';

@Injectable()
export class MeasurementsService {
  constructor(@InjectRepository(AirQualityMeasurement) private repo: Repository<AirQualityMeasurement>) {}

  create(dto: CreateMeasurementDto) {
    const e: any = this.repo.create({ dateTime: new Date(dto.dateTime), value: dto.value } as any);
    if (dto.stationID) e.station = { stationID: dto.stationID };
    if (dto.pollutantID) e.pollutant = { pollutantID: dto.pollutantID };
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find({ relations: ['station', 'pollutant'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { measurementID: id }, relations: ['station', 'pollutant'] });
  }

  async update(id: number, dto: UpdateMeasurementDto) {
    const toUpdate: any = {};
    if (dto.dateTime) toUpdate.dateTime = new Date(dto.dateTime as any);
    if (dto.value !== undefined) toUpdate.value = dto.value;
    if (dto.stationID !== undefined) toUpdate.station = dto.stationID ? { stationID: dto.stationID } : null;
    if (dto.pollutantID !== undefined) toUpdate.pollutant = dto.pollutantID ? { pollutantID: dto.pollutantID } : null;
    await this.repo.update(id, toUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
