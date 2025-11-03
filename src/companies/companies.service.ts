import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from './create-company.dto';
import { UpdateCompanyDto } from './update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private repo: Repository<Company>) {}

  async create(dto: CreateCompanyDto) {
    try {
      if (!dto || !dto.companyName) {
        throw new BadRequestException('companyName is required');
      }

      // Create base company entity
      const company = this.repo.create({
        companyName: dto.companyName
      });

      // Add relations if IDs are provided
      if (dto.cityID) {
        company.city = { cityID: dto.cityID } as any;
      }
      if (dto.locationID) {
        company.location = { locationID: dto.locationID } as any;
      }

      console.log('Creating company with data:', {
        companyName: dto.companyName,
        cityID: dto.cityID,
        locationID: dto.locationID
      });

      return await this.repo.save(company);
    } catch (error) {
      console.error('Error creating company:', error);
      if (error instanceof BadRequestException) throw error;
      if (error.code === '23502') { // NOT NULL violation
        throw new BadRequestException('CompanyName is required');
      }
      if (error.code === '23503') { // Foreign key violation
        throw new BadRequestException('Invalid cityID or locationID');
      }
      throw new InternalServerErrorException('Failed to create company: ' + error.message);
    }
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
