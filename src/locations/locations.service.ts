import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateLocationDto } from './create-location.dto';
import { UpdateLocationDto } from './update-location.dto';

@Injectable()
export class LocationsService {
  constructor(@InjectRepository(Location) private repo: Repository<Location>) {}

  create(dto: CreateLocationDto) {
    const e = this.repo.create(dto as any);
    return this.repo.save(e);
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
