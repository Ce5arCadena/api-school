import { 
  Get, 
  Put, 
  Post, 
  Body,
  Param, 
  Delete, 
  Controller,
} from '@nestjs/common';
import { CurrentUser, Roles } from 'src/auth/decorator';
import { SubjectsService } from './subjects.service';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('subjects')
@Roles(UserRole.SCHOOL)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto,@CurrentUser() userAuth: JwtPayload) {
    return this.subjectsService.create(createSubjectDto, userAuth);
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateSubjectDto: UpdateSubjectDto, @CurrentUser() userAuth: JwtPayload) {
    return this.subjectsService.update(id, updateSubjectDto, userAuth);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }
}
