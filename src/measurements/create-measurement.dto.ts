import { IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMeasurementDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stationID?: number;

  @IsNotEmpty()
  @IsDateString()
  dateTime: string | Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pollutantID?: number;

  @IsNotEmpty()
  @Type(() => Number)
  value: number;
}