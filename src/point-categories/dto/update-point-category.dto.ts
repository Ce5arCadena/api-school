import { PartialType } from '@nestjs/mapped-types';
import { CreatePointCategoryDto } from './create-point-category.dto';

export class UpdatePointCategoryDto extends PartialType(CreatePointCategoryDto) {}
