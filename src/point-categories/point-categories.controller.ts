import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PointCategoriesService } from './point-categories.service';
import { CreatePointCategoryDto } from './dto/create-point-category.dto';
import { UpdatePointCategoryDto } from './dto/update-point-category.dto';

@Controller('point-categories')
export class PointCategoriesController {
  constructor(private readonly pointCategoriesService: PointCategoriesService) {}

  @Post()
  create(@Body() createPointCategoryDto: CreatePointCategoryDto) {
    return this.pointCategoriesService.create(createPointCategoryDto);
  }

  @Get()
  findAll() {
    return this.pointCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePointCategoryDto: UpdatePointCategoryDto) {
    return this.pointCategoriesService.update(+id, updatePointCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointCategoriesService.remove(+id);
  }
}
