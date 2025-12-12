import { IsNotEmpty, IsString } from "class-validator";

export class CreateGradeDto {
    @IsString({message: 'El nombre debe ser un texto'})
    @IsNotEmpty({message: 'El nombre no puede ser vacío'})
    name: string;
}
