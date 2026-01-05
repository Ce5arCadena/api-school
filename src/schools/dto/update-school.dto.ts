import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSchoolDto {
    @IsString({ message: 'El nombre es requerido'})
    @IsNotEmpty({ message: 'El nombre es requerido'})
    name: string;
}
