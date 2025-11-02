import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Station } from './station.entity';
import { Pollutant } from './pollutant.entity';

@Entity({ name: 'AirQualityMeasurements' })
export class AirQualityMeasurement {
  @PrimaryGeneratedColumn({ name: 'MeasurementID' })
  measurementID: number;

  @ManyToOne(() => Station, (s) => s.measurements, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'StationID' })
  station: Station;

  @Column({ name: 'DateTime', type: 'timestamp' })
  dateTime: Date;

  @ManyToOne(() => Pollutant, (p) => p.measurements, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'PollutantID' })
  pollutant: Pollutant;

  @Column({ name: 'Value', type: 'decimal', precision: 8, scale: 4 })
  value: string;
}
