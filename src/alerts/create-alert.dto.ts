import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAlertDto {
    @IsString()
    @IsNotEmpty()
    content: string;
}