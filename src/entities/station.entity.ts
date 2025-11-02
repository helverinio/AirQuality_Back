import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Location } from './location.entity';
import { Pollutant } from './pollutant.entity';
import { AirQualityMeasurement } from './air-quality-measurement.entity';

@Entity({ name: 'Station' })
export class Station {
  @PrimaryGeneratedColumn({ name: 'StationID' })
  stationID: number;

  @Column({ name: 'StationName', length: 50 })
  stationName: string;

  @ManyToOne(() => Location, (location) => location.stations, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'LocationID' })
  location: Location;

  @ManyToOne(() => Pollutant, (pollutant) => pollutant.stations, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'PollutantID' })
  pollutant: Pollutant;

  @OneToMany(() => AirQualityMeasurement, (m) => m.station)
  measurements: AirQualityMeasurement[];
}
