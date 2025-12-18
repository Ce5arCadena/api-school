import { 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Controller, 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser, Public, Roles } from 'src/auth/decorator';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-super')
  // @Roles(UserRole.SUPERADMIN)
  @Public()
  createSuperAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createSuper(createUserDto, UserRole.SUPERADMIN);
  }

  @Post('create-school')
  @Roles(UserRole.SUPERADMIN)
  createSchool(@Body() createUserDto: CreateUserDto, @CurrentUser() userAuth: JwtPayload) {
    return this.usersService.create(createUserDto, UserRole.SCHOOL, userAuth);
  }

  @Post('create-teacher')
  @Roles(UserRole.SCHOOL)
  createTeacher(@Body() createUserDto: CreateUserDto, @CurrentUser() userAuth: JwtPayload) {
    return this.usersService.create(createUserDto, UserRole.TEACHER, userAuth);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
