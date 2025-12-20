import { 
  HttpStatus, 
  Injectable, 
  HttpException, 
  UnauthorizedException, 
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { ParamsFindAllDto } from './dto/params-find-all.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade) 
    private gradeRepository: Repository<Grade>,
    private usersService: UsersService,
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
        });
      };

      const gradeExist = await this.gradeRepository.findOneBy({name: createGradeDto.name, school: userAuth.school});
      if (gradeExist) {
        return {
          message: 'Ya existe un curso con el mismo nombre',
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      };

      const grade = await this.gradeRepository.save({...createGradeDto, school: userAuth});
      const gradeSerialize = plainToInstance(Grade, grade);

      return {
        message: 'Curso creado.',
        status: HttpStatus.CREATED,
        icon: 'success',
        data: gradeSerialize
      };
    } catch (error) {
      console.log(error)
      throw new HttpException({
        message: 'Error al crear el curso',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  async findAll(params: ParamsFindAllDto, user: JwtPayload) {
    return `This action returns all grades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grade`;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto, user: JwtPayload) {
    try {
      const userAuth = await this.usersService.findByEmail(user.email);
      if (!userAuth) {
        throw new UnauthorizedException({
          message: 'No está autorizado.',
          status: HttpStatus.UNAUTHORIZED,
          icon: 'error',
        });
      };

      const grade = await this.gradeRepository.findOneBy({ id, school: userAuth.school });
      if (!grade) {
        return {
          message: 'No se encontró el curso.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      if (grade.id !== id) {
        return {
          message: 'Ya existe un curso registrado con ese nombre.',
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      }

      await this.gradeRepository.update({ id, school: userAuth.school }, { name: updateGradeDto.name });
      return {
        message: 'Curso actualizado.',
        status: HttpStatus.OK,
        icon: 'success',
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

  async remove(id: number, user: JwtPayload) {
    try {
      const userAuth = await this.usersService.findByEmail(user.email);
      if (!userAuth) {
        throw new UnauthorizedException({
          message: 'No está autorizado.',
          status: HttpStatus.UNAUTHORIZED,
          icon: 'error',
        });
      };

      const grade = await this.gradeRepository.findOne({
        where: {
          id,
          school: { id: userAuth.id }
        }
      });

      if (!grade) {
        return {
          message: 'No se encontró el curso.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const gradeUpdateState = await this.gradeRepository.update({ id }, { isActive: 'INACTIVE' });
      return {
        message: 'Curso eliminado.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      console.log(error)
      throw new HttpException({
        message: 'Error al eliminar el curso',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }
}
