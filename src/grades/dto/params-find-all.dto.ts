import { IsInt, IsOptional, IsString } from "class-validator";

export class ParamsFindAllDto {
    @IsInt({message: 'El limite debe ser un número'})
    @IsOptional()
    limit: number;

    @IsInt({message: 'El limite debe ser un número'})
    @IsOptional()
    offset: number;

    @IsString({message: 'El parámetro de búsqueda debe ser texto'})
    @IsOptional()
    search: string;
}