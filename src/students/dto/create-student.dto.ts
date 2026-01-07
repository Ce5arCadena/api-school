import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumberString, IsString, MaxLength } from "class-validator";

export class CreateStudentDto {
    @IsString({ message: 'El nombre debe ser texto.'})
    @IsNotEmpty({ message: 'El nombre es requerido.' })
    name: string;

    @IsString({ message: 'El apellido debe ser texto.'})
    @IsNotEmpty({ message: 'El apellido es requerido.' })
    lastname: string;

    @IsNumberString()
    @IsNotEmpty({ message: 'El documento es requerido'})
    document: string;

    @IsNumberString()
    @IsNotEmpty({ message: 'El celular es requerido'})
    @MaxLength(10, { message: 'Máximo 10 digitos para el celular' })
    phone: string;

    @Type(() => Number)
    @IsInt({ message: 'El grado debe ser válido'})
    @IsNotEmpty({ message: 'El grado es requerido'})
    grade: number;
}

