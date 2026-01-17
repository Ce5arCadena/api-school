import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateRegistryPointDto {
    @IsNotEmpty({ message: 'Los puntos son requeridos'})
    @IsInt({ message: 'Los puntos deben ser números'})
    @Type(() => Number)
    points: number;

    @IsNotEmpty({ message: 'El estudiante es requerido'})
    @IsInt({ message: 'El identificador del estudiante debe ser un número'})
    @Type(() => Number)
    student: number;

    @IsNotEmpty({ message: 'La categoría de puntos es requerida'})
    @IsInt({ message: 'La categoría de puntos debe ser un número'})
    @Type(() => Number)
    pointCategory: number;

    @IsNotEmpty({ message: 'La materia es requerida'})
    @IsInt({ message: 'La materia de asignación debe ser un número'})
    @Type(() => Number)
    subject: number;
}
