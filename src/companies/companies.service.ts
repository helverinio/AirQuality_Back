import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from './create-company.dto';
import { UpdateCompanyDto } from './update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private repo: Repository<Company>) {}

  create(dto: CreateCompanyDto) {
    const e: any = this.repo.create({ companyName: dto.companyName });
    if (dto.cityID) e.city = { cityID: dto.cityID };
    if (dto.locationID) e.location = { locationID: dto.locationID };
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find({ relations: ['city', 'location'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { companyID: id }, relations: ['city', 'location'] });
  }

  async update(id: number, dto: UpdateCompanyDto) {
    const toUpdate: any = {};
    if (dto.companyName) toUpdate.companyName = dto.companyName;
    if (dto.cityID !== undefined) toUpdate.city = dto.cityID ? { cityID: dto.cityID } : null;
    if (dto.locationID !== undefined) toUpdate.location = dto.locationID ? { locationID: dto.locationID } : null;
    await this.repo.update(id, toUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
