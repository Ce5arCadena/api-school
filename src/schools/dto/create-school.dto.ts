import { User } from "src/users/entities/user.entity";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateSchoolDto {
    @IsString({ message: 'El nombre debe ser texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @IsNotEmpty({ message: 'El usuario es requerido' })
    @Type(() => User)
    user: User;
}
