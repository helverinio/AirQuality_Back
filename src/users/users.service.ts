import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(dto: CreateUserDto) {
    const e: any = this.repo.create({ fullName: dto.fullName, email: dto.email, password: dto.password, phone: dto.phone });
    if (dto.companyID) e.company = { companyID: dto.companyID };
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find({ relations: ['company'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { userID: id }, relations: ['company'] });
  }

  async update(id: number, dto: UpdateUserDto) {
    const toUpdate: any = {};
    if (dto.fullName) toUpdate.fullName = dto.fullName;
    if (dto.email) toUpdate.email = dto.email;
    if (dto.phone) toUpdate.phone = dto.phone;
    if (dto.password) toUpdate.password = dto.password;
    if (dto.companyID !== undefined) toUpdate.company = dto.companyID ? { companyID: dto.companyID } : null;
    await this.repo.update(id, toUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
