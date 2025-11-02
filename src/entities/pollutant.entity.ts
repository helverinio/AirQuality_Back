import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Station } from './station.entity';
import { AirQualityMeasurement } from './air-quality-measurement.entity';

@Entity({ name: 'Pollutant' })
export class Pollutant {
  @PrimaryGeneratedColumn({ name: 'PollutantID' })
  pollutantID: number;

  @Column({ name: 'Description', length: 50 })
  description: string;

  @Column({ name: 'UnitOfMeasure', length: 20 })
  unitOfMeasure: string;

  @OneToMany(() => Station, (s) => s.pollutant)
  stations: Station[];

  @OneToMany(() => AirQualityMeasurement, (m) => m.pollutant)
  measurements: AirQualityMeasurement[];
}
