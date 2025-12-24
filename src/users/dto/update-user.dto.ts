import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsEmail({}, { message: 'El correo no cumple el formato' })
    @IsNotEmpty({ message: 'El correo es requerido' })
    email: string;
}
