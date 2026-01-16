import { CurrentUser, Roles } from 'src/auth/decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { PointCategoriesService } from './point-categories.service';
import { ParamsFindAllDto } from 'src/grades/dto/params-find-all.dto';
import { CreatePointCategoryDto } from './dto/create-point-category.dto';
import { UpdatePointCategoryDto } from './dto/update-point-category.dto';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';

@Roles(UserRole.TEACHER)
@Controller('point-categories')
export class PointCategoriesController {
  constructor(private readonly pointCategoriesService: PointCategoriesService) {}

  @Post()
  create(@Body() createPointCategoryDto: CreatePointCategoryDto, @CurrentUser() userAuth: JwtPayload) {
    return this.pointCategoriesService.create(createPointCategoryDto, userAuth);
  }

  @Get()
  findAll(@Query() params: ParamsFindAllDto, @CurrentUser() userAuth: JwtPayload) {
    return this.pointCategoriesService.findAll(params, userAuth);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() userAuth: JwtPayload) {
    return this.pointCategoriesService.findOne(id, userAuth);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updatePointCategoryDto: UpdatePointCategoryDto, @CurrentUser() userAuth: JwtPayload) {
    return this.pointCategoriesService.update(id, updatePointCategoryDto, userAuth);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() userAuth: JwtPayload) {
    return this.pointCategoriesService.remove(id, userAuth);
  }
}
