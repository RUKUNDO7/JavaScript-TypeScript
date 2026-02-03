import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
    @IsOptional()
    @IsBoolean()
    completed?: boolean;

    @IsOptional()
    @IsString()
    title?: string;
}