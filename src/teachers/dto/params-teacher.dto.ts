import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class ParamsTeacherDto {
    @IsInt({message: 'El limite debe ser un número'})
    @IsOptional()
    @Type(() => Number)
    limit: number = 10;

    @IsInt({message: 'El limite debe ser un número'})
    @IsOptional()
    @Type(() => Number)
    offset: number = 0;

    @IsString({message: 'El parámetro de búsqueda debe ser texto.'})
    @IsOptional()
    search: string = '';
}