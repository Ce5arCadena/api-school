import { IsNotEmpty, IsString } from "class-validator";

export class CreateSchoolDto {
    @IsString({ message: 'El nombre debe ser texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;
}
