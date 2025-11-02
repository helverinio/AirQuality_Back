import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Company } from './company.entity';

@Entity({ name: 'City' })
export class City {
  @PrimaryGeneratedColumn({ name: 'CityID' })
  cityID: number;

  @Column({ name: 'CityName', length: 50 })
  cityName: string;

  @OneToMany(() => Company, (company) => company.city)
  companies: Company[];
}
