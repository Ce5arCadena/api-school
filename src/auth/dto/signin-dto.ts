import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";


export class SignInDto {
    @IsEmail({}, { message: 'El correo es incorrecto '})
    @IsNotEmpty({ message: 'El correo es requerido' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es requerida '})
    @IsStrongPassword({}, { message: 'La contraseña no cumple el formato'})
    password: string;
}