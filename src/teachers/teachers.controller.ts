import { 
  Get, 
  Put,
  Post, 
  Body, 
  Param, 
  Query,
  Delete,
  UseGuards, 
  Controller,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser, Roles } from 'src/auth/decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ParamsTeacherDto } from './dto/params-teacher.dto';

@Controller('teachers')
@Roles(UserRole.SCHOOL)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto, @CurrentUser() userAuth: JwtPayload) {
    return this.teachersService.create(createTeacherDto, userAuth);
  }

  @Get()
  findAll(@Query() params: ParamsTeacherDto, @CurrentUser() userAuth: JwtPayload) {
    return this.teachersService.findAll(params, userAuth);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTeacherDto: UpdateTeacherDto, @CurrentUser() userAuth: JwtPayload) {
    return this.teachersService.update(id, updateTeacherDto, userAuth);
  }

  @Delete(':id')
  remove(@Param('id') id:number, @CurrentUser() userAuth: JwtPayload) {
    return this.teachersService.remove(id, userAuth);
  }
}
