import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { City } from './city.entity';
import { Location } from './location.entity';
import { User } from './user.entity';

@Entity({ name: 'Company' })
export class Company {
  @PrimaryGeneratedColumn({ name: 'CompanyID' })
  companyID: number;

  @Column({ name: 'CompanyName', length: 50 })
  companyName: string;

  @ManyToOne(() => City, (city) => city.companies, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'CityID' })
  city: City;

  @ManyToOne(() => Location, (location) => location.companies, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'LocationID' })
  location: Location;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
