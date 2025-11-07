import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cityID?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  locationID?: number;
}
