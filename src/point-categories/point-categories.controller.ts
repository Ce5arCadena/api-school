import { CurrentUser, Roles } from 'src/auth/decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { PointCategoriesService } from './point-categories.service';
import { CreatePointCategoryDto } from './dto/create-point-category.dto';
import { UpdatePointCategoryDto } from './dto/update-point-category.dto';
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';

@Roles(UserRole.TEACHER)
@Controller('point-categories')
export class PointCategoriesController {
  constructor(private readonly pointCategoriesService: PointCategoriesService) {}

  @Post()
  create(@Body() createPointCategoryDto: CreatePointCategoryDto, @CurrentUser() userAuth: JwtPayload) {
    return this.pointCategoriesService.create(createPointCategoryDto, userAuth);
  }

  @Get()
  findAll() {
    return this.pointCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointCategoriesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePointCategoryDto: UpdatePointCategoryDto, @CurrentUser() userAuth: JwtPayload) {
    return this.pointCategoriesService.update(+id, updatePointCategoryDto, userAuth);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointCategoriesService.remove(+id);
  }
}
