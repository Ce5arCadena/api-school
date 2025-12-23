import { 
  HttpStatus, 
  Injectable, 
  HttpException, 
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private usersService: UsersService,
  ) {}

  async create(createTeacherDto: CreateTeacherDto, user: JwtPayload) {
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

      const teacherExists = await this.teacherRepository.findOneBy({fullName: createTeacherDto.fullName, school: {id: userAuth.id} });
      if (teacherExists) {
        return {
          message: 'Ya existe un profesor con el mismo nombre',
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      };

      const newUser = await this.usersService.create({email: createTeacherDto.email, name: createTeacherDto.fullName, password: createTeacherDto.password}, UserRole.TEACHER, user);
      if (newUser.status !== HttpStatus.CREATED) {
        return {
          message: 'Ocurrió un error al crear el profesor. Intenta de nuevo',
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      };
      const newTeacher = await this.teacherRepository.save({
        fullName: createTeacherDto.fullName, 
        document: createTeacherDto.document, 
        phone: createTeacherDto.phone.trim(),
        school: { id: userAuth.id }
      });
      
      return {
        message: 'Profesor creado.',
        status: HttpStatus.CREATED,
        icon: 'success',
        data: {
          phone: newTeacher.phone.trim(),
          document: newTeacher.document.trim(),
          fullName: newTeacher.fullName.trim(),
          email: createTeacherDto.email,
          id: newTeacher.id,
          created: newTeacher.created,
          updated: newTeacher.updated,
          state: newTeacher.isActive
        }
      };
    } catch (error) {
      console.log(error);
      throw new HttpException({
        message: 'Error al crear el profesor',
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
