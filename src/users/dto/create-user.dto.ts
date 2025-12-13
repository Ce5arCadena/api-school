import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString({ message: 'El nombre es requerido' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;

    @IsEmail({}, { message: 'El correo no cumple el formato' })
    @IsNotEmpty({ message: 'El correo es requerido' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es requerida'})
    @IsStrongPassword({}, {message: 'La contraseña no cumple el formato'})
    password: string;
}
