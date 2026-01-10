import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePointCategoryDto {
    @IsString({ message: 'El nombre de la categoria debe ser texto.'})
    @IsNotEmpty({ message: 'El nombre de la categoria es requerido.'})
    name: string;

    @IsInt({ message: 'Los puntos deben ser un número.'})
    @IsNotEmpty({ message: 'Los puntos máximos son requeridos.'})
    @Type(() => Number)
    maxPoints: number;

    @IsInt({ message: 'La asignatura relacionada debe ser un número.'})
    @IsNotEmpty({ message: 'Los asignatura relacionada es requerida.'})
    @Type(() => Number)
    subject: number;
}
