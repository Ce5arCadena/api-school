import { Injectable } from '@nestjs/common';
import { CreatePointCategoryDto } from './dto/create-point-category.dto';
import { UpdatePointCategoryDto } from './dto/update-point-category.dto';

@Injectable()
export class PointCategoriesService {
  create(createPointCategoryDto: CreatePointCategoryDto) {
    return 'This action adds a new pointCategory';
  }

  findAll() {
    return `This action returns all pointCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pointCategory`;
  }

  update(id: number, updatePointCategoryDto: UpdatePointCategoryDto) {
    return `This action updates a #${id} pointCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} pointCategory`;
  }
}
