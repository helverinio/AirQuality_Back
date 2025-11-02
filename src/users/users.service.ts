import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const e: any = this.repo.create({ fullName: dto.fullName, email: dto.email, password: hashed, phone: dto.phone });
    if (dto.companyID) e.company = { companyID: dto.companyID };
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find({ relations: ['company'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { userID: id }, relations: ['company'] });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto) {
    const toUpdate: any = {};
    if (dto.fullName) toUpdate.fullName = dto.fullName;
    if (dto.email) toUpdate.email = dto.email;
    if (dto.phone) toUpdate.phone = dto.phone;
  if (dto.password) toUpdate.password = await bcrypt.hash(dto.password, 10);
    if (dto.companyID !== undefined) toUpdate.company = dto.companyID ? { companyID: dto.companyID } : null;
    await this.repo.update(id, toUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
