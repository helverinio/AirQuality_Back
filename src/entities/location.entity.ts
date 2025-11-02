import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Company } from './company.entity';
import { Station } from './station.entity';

@Entity({ name: 'Location' })
export class Location {
  @PrimaryGeneratedColumn({ name: 'LocationID' })
  locationID: number;

  @Column({ name: 'LocationName', length: 50 })
  locationName: string;

  @Column({ type: 'float', name: 'Latitude', nullable: true })
  latitude: number;

  @Column({ type: 'float', name: 'Longitude', nullable: true })
  longitude: number;

  @OneToMany(() => Company, (company) => company.location)
  companies: Company[];

  @OneToMany(() => Station, (station) => station.location)
  stations: Station[];
}
