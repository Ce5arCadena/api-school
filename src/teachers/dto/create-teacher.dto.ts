import { OmitType } from "@nestjs/mapped-types";
import { IsInt, IsNotEmpty, IsNumberString, IsString, Length } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateTeacherDto extends OmitType(CreateUserDto, ["name"] as const) {
    @IsString({ message: 'Debe ser texto el nombre' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    fullName: string;

    @IsNumberString({}, { message: 'Debe ser texto el documento' })
    @Length(6, 12, { message: 'Mínimo 6 y máximo 10 dígitos para el documento'})
    @IsNotEmpty({ message: 'El documento es requerido' })
    document: string;

    @IsNumberString({}, { message: 'Debe ser texto el celular' })
    @Length(10, 10, { message: 'Máximo 10 dígitos para el celular'})
    @IsNotEmpty({ message: 'El celular es requerido' })
    phone: string;
}
