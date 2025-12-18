import { Type } from "class-transformer";
import { User } from "src/users/entities/user.entity";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateSchoolDto {
    @IsInt({message: 'Debe ser un número'})
    @IsNotEmpty({message: 'El id es requerido'})
    id: number;

    @IsString({ message: 'El nombre debe ser texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @IsNotEmpty({ message: 'El usuario es requerido' })
    @Type(() => User)
    user: User;
}
