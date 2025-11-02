import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pollutant } from '../entities/pollutant.entity';
import { PollutantsService } from './pollutants.service';
import { PollutantsController } from './pollutants.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pollutant])],
  controllers: [PollutantsController],
  providers: [PollutantsService],
  exports: [PollutantsService],
})
export class PollutantsModule {}
