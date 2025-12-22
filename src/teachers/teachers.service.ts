import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TeachersService {
  create(createTeacherDto: CreateTeacherDto, user: JwtPayload) {
    try {
      console.log(createTeacherDto);
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear el recurso',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  findAll() {
    return `This action returns all teachers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
