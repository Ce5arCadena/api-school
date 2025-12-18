import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateTeacherDto {
    @IsString({ message: 'Debe ser texto el nombre' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    fullName: string;

    @IsInt({ message: 'Debe ser números el documento' })
    @IsNotEmpty({ message: 'El documento es requerido' })
    document: string;

    @IsInt({ message: 'Debe ser números el celular' })
    @IsNotEmpty({ message: 'El celular es requerido' })
    phone: string;
}
