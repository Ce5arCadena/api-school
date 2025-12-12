import { PickType } from '@nestjs/mapped-types';
import { CreateGradeDto } from './create-grade.dto';

export class UpdateGradeDto extends PickType(CreateGradeDto, ['name'] as const) {}
