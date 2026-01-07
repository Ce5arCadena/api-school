import { 
  Put, 
  Get, 
  Post, 
  Body, 
  Query, 
  Param, 
  Delete, 
  Controller, 
} from '@nestjs/common';
import { QueryParamsBase    } from 'src/utils/dtos';
import { StudentsService    } from './students.service';
import { CurrentUser, Roles } from 'src/auth/decorator';
import { CreateStudentDto   } from './dto/create-student.dto';
import { UpdateStudentDto   } from './dto/update-student.dto';
import { JwtPayload         } from 'src/auth/dto/jwt-payload.dto';
import { UserRole           } from 'src/users/entities/user.entity';

@Controller('students')
@Roles(UserRole.SCHOOL)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto, @CurrentUser() userAuth: JwtPayload) {
    return this.studentsService.create(createStudentDto, userAuth);
  }

  @Get()
  findAll(@Query() params: QueryParamsBase, @CurrentUser() userAuth: JwtPayload) {
    return this.studentsService.findAll(params, userAuth);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() userAuth: JwtPayload) {
    return this.studentsService.findOne(id, userAuth);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateStudentDto: UpdateStudentDto, @CurrentUser() userAuth: JwtPayload) {
    return this.studentsService.update(id, updateStudentDto, userAuth);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() userAuth: JwtPayload) {
    return this.studentsService.remove(id, userAuth);
  }
}
