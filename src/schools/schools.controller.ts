import { 
  Put, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Controller, 
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CurrentUser, Roles } from 'src/auth/decorator';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.SUPERADMIN)
  update(@Param('id') id: number, @Body() updateSchoolDto: UpdateSchoolDto, @CurrentUser() userAuth: JwtPayload) {
    return this.schoolsService.update(id, updateSchoolDto, userAuth);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(+id);
  }
}
