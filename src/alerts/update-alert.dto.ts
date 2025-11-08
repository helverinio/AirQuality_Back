import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateAlertDto {
    @IsString()
    @IsOptional()
    content?: string;

    @IsBoolean()
    @IsOptional()
    isRead?: boolean;
}