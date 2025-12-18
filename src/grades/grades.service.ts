import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade) 
    private gradeRepository: Repository<Grade>,
    private usersService: UsersService
  ) {}

  async create(createGradeDto: CreateGradeDto, user: JwtPayload) {
    try {
      //Usuario autenticado
      const userAuth = await this.usersService.findByEmail(user.email);
      if (!userAuth) {
        throw new UnauthorizedException({
          message: 'No está autorizado.',
          status: HttpStatus.UNAUTHORIZED,
          icon: 'error',
          errors: [],
        });
      };

      const grade = await this.gradeRepository.save({...createGradeDto, school: userAuth});

      return {
        message: 'Curso creado.',
        status: HttpStatus.CREATED,
        icon: 'success',
        errors: [],
        data: grade
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear el curso',
        icon: 'error',
        errors: [],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  findAll() {
    return `This action returns all grades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grade`;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    try {
      const grade = await this.gradeRepository.findOneBy({ id });
      if (!grade) {
        return {
          message: 'No se encontró el curso.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
          errors: [`El recurso especificado (${id}), no se encontró`]
        };
      };

    } catch (error) {
      throw new HttpException({
        message: 'Error al actualizar el curso',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  remove(id: number) {
    return `This action removes a #${id} grade`;
  }
}
