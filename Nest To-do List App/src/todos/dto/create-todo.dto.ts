import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}