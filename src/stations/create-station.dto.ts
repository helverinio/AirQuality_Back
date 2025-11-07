import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStationDto {
  @IsString()
  @IsNotEmpty()
  stationName: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  locationID?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pollutantID?: number;
}
