import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsString()
    title?: string;
}