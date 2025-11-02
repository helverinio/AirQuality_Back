import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'UserID' })
  userID: number;

  @Column({ name: 'FullName', length: 50 })
  fullName: string;

  @Column({ name: 'Phone', length: 50, nullable: true })
  phone: string;

  @Column({ name: 'Email', length: 50 })
  email: string;

  @ManyToOne(() => Company, (company) => company.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'CompanyID' })
  company: Company;

  @Column({ name: 'Password', length: 200 })
  password: string;
}
