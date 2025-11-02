import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQualityMeasurement } from '../entities/air-quality-measurement.entity';
import { MeasurementsService } from './measurements.service';
import { MeasurementsController } from './measurements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AirQualityMeasurement])],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
  exports: [MeasurementsService],
})
export class MeasurementsModule {}
