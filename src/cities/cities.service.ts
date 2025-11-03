import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { CreateCityDto } from './create-city.dto';
import { UpdateCityDto } from './update-city.dto';

@Injectable()
export class CitiesService {
  constructor(@InjectRepository(City) private repo: Repository<City>) {}

  async create(dto: CreateCityDto) {
    try {
      if (!dto || !dto.cityName) {
        throw new BadRequestException('cityName is required');
      }

      const entity = this.repo.create({ cityName: dto.cityName });
      return await this.repo.save(entity);
    } catch (error) {
      console.error('Error creating city:', error);
      // Surface clearer error for client
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create city');
    }
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
