import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePollutantDto {
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Unit of measure is required' })
  unitOfMeasure: string;
}
