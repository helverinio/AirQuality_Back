import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pollutant } from '../entities/pollutant.entity';
import { CreatePollutantDto } from './create-pollutant.dto';
import { UpdatePollutantDto } from './update-pollutant.dto';

@Injectable()
export class PollutantsService {
  constructor(@InjectRepository(Pollutant) private repo: Repository<Pollutant>) {}

  create(dto: CreatePollutantDto) {
    const e = this.repo.create(dto as any);
    return this.repo.save(e);
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
