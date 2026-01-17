import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class QueryParamsBase {
    @IsInt({ message: 'El limite debe ser un número.'})
    @Type(() => Number)
    @IsOptional()
    limit: number = 10;

    @IsInt({ message: 'El offset debe ser un número.'})
    @Type(() => Number)
    @IsOptional()
    offset: number = 0;

    @IsString({ message: 'El parámetro de búsqueda debe ser texto.'})
    @IsOptional()
    search: string = '';
}

export class FindAllRegistryPoints {
    @IsInt({ message: 'Debe especificar la materia.'})
    @Type(() => Number)
    idSubject: number;

    @IsInt({ message: 'Debe especificar el grado.'})
    @Type(() => Number)
    idGrade: number;
}