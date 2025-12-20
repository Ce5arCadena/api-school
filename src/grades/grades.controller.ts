import { 
  Put, 
  Get, 
  Post, 
  Body, 
  Query, 
  Param, 
  Delete, 
  UseGuards, 
  Controller, 
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser, Roles } from 'src/auth/decorator';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { ParamsFindAllDto } from './dto/params-find-all.dto';

@Controller('grades')
@UseGuards(AuthGuard)
@Roles(UserRole.SCHOOL)
export class GradesController {
  constructor(
    private readonly gradesService: GradesService,
  ) {}

  @Post()
  create(@Body() createGradeDto: CreateGradeDto, @CurrentUser() userAuth: JwtPayload ) {
    return this.gradesService.create(createGradeDto, userAuth);
  }

  @Get()
  findAll(
    @Query() params: ParamsFindAllDto,
    @CurrentUser() userAuth: JwtPayload
  ) {
    return this.gradesService.findAll(params, userAuth);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.gradesService.findOne(+id);
  // }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateGradeDto: UpdateGradeDto, @CurrentUser() userAuth: JwtPayload) {
    return this.gradesService.update(id, updateGradeDto, userAuth);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() userAuth: JwtPayload) {
    return this.gradesService.remove(id, userAuth);
  }
}
