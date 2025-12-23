import { OmitType } from "@nestjs/mapped-types";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateTeacherDto extends OmitType(CreateUserDto, ["name"] as const) {
    @IsString({ message: 'Debe ser texto el nombre' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    fullName: string;

    @IsString({ message: 'Debe ser texto el documento' })
    @IsNotEmpty({ message: 'El documento es requerido' })
    document: string;

    @IsString({ message: 'Debe ser texto el celular' })
    @IsNotEmpty({ message: 'El celular es requerido' })
    phone: string;
}
