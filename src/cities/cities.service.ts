import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { CreateCityDto } from './create-city.dto';
import { UpdateCityDto } from './update-city.dto';

@Injectable()
export class CitiesService {
  constructor(@InjectRepository(City) private repo: Repository<City>) {}

  create(dto: CreateCityDto) {
    const entity = this.repo.create({ cityName: dto.cityName });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ cityID: id });
  }

  async update(id: number, dto: UpdateCityDto) {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
