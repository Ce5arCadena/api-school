import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { IsObject, IsOptional } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';
import { Grade } from 'src/grades/entities/grade.entity';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
    @IsObject()
    @IsOptional()
    @Type(() => Grade)
    gradeData?: Grade;
}
