import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-super')
  createSuperAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, UserRole.SUPERADMIN);
  }

  @Post('create-school')
  createSchool(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, UserRole.SCHOOL);
  }

  @Post('create-teacher')
  createTeacher(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, UserRole.TEACHER);
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
