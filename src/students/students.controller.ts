import { StudentsService } from './students.service';
import { CurrentUser, Roles } from 'src/auth/decorator';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

@Controller('students')
@Roles(UserRole.SCHOOL)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto, @CurrentUser() userAuth: JwtPayload) {
    return this.studentsService.create(createStudentDto, userAuth);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
