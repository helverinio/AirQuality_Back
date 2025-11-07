import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  companyID?: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
