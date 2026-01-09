import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateSubjectDto {
    @IsString({ message: 'El nombre de la materia debe ser texto.'})
    @IsNotEmpty({ message: 'El nombre de la matwria es requerido.' })
    name: string;

    @Type(() => Number)
    @IsInt({ message: 'El grado debe ser un ID válido.' })
    @IsNotEmpty({ message: 'Debe seleccionar un grado para esta asignatura.' })
    grade: number;

    @Type(() => Number)
    @IsInt({ message: 'El profesor debe ser un ID válido.'})
    @IsNotEmpty({ message: 'Debe seleccionar un profesor para esta asignatura.'})
    teacher: number;
}
