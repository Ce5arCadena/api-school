import { GradesService } from './grades.service';
import { CurrentUser, Roles } from 'src/auth/decorator';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';

@Controller('grades')
export class GradesController {
  constructor(
    private readonly gradesService: GradesService,
  ) {}

  @Post()
  @Roles(UserRole.SCHOOL)
  create(@Body() createGradeDto: CreateGradeDto, @CurrentUser() userAuth: JwtPayload ) {
    return this.gradesService.create(createGradeDto, userAuth);
  }

  // @Get()
  // findAll() {
  //   return this.gradesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.gradesService.findOne(+id);
  // }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(id, updateGradeDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gradesService.remove(+id);
  // }
}
