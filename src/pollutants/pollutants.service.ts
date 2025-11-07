import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pollutant } from '../entities/pollutant.entity';
import { CreatePollutantDto } from './create-pollutant.dto';
import { UpdatePollutantDto } from './update-pollutant.dto';

@Injectable()
export class PollutantsService {
  constructor(@InjectRepository(Pollutant) private repo: Repository<Pollutant>) {}

  async create(dto: CreatePollutantDto) {
    try {
      if (!dto.description || !dto.unitOfMeasure) {
        throw new BadRequestException('Description and unit of measure are required');
      }

      const pollutant = this.repo.create({
        description: dto.description,
        unitOfMeasure: dto.unitOfMeasure
      });

      console.log('Creating pollutant:', {
        description: dto.description,
        unitOfMeasure: dto.unitOfMeasure
      });

      return await this.repo.save(pollutant);
    } catch (error) {
      console.error('Error creating pollutant:', error);
      if (error instanceof BadRequestException) throw error;
      if (error.code === '23502') {
        throw new BadRequestException('Description and unit of measure are required');
      }
      throw new InternalServerErrorException('Failed to create pollutant: ' + error.message);
    }
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ pollutantID: id });
  }

  async update(id: number, dto: UpdatePollutantDto) {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
