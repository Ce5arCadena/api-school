import { 
  Get, 
  Put, 
  Post, 
  Body,
  Param, 
  Delete, 
  Controller,
  Query,
} from '@nestjs/common';
import { QueryParamsBase } from 'src/utils/dtos';
import { SubjectsService } from './subjects.service';
import { CurrentUser, Roles } from 'src/auth/decorator';
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
  findAll(
    @Query() params: QueryParamsBase,
    @CurrentUser() userAuth: JwtPayload
  ) {
    return this.subjectsService.findAll(params, userAuth);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() userAuth: JwtPayload) {
    return this.subjectsService.findOne(id, userAuth);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateSubjectDto: UpdateSubjectDto, @CurrentUser() userAuth: JwtPayload) {
    return this.subjectsService.update(id, updateSubjectDto, userAuth);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() userAuth: JwtPayload) {
    return this.subjectsService.remove(id, userAuth);
  }
}
