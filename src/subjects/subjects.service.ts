import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { UsersService } from 'src/users/users.service';
import { Grade } from 'src/grades/entities/grade.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,

    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,

    private usersService: UsersService
  ){}

  async create(createSubjectDto: CreateSubjectDto, user: JwtPayload) {
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

      const subjectExists = await this.subjectRepository.findOne({
        where: {
          name: createSubjectDto.name.trim(),
          school: {
            id: userAuth.id
          },
          isActive: 'ACTIVE'
        }
      });
      if (subjectExists) {
        return {
          message: 'Ya existe una materia con el mismo nombre',
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      };

      const gradeExists = await this.gradeRepository.findOne({
        where: {
          id: createSubjectDto.grade,
          isActive: 'ACTIVE',
          school: {
            id: userAuth.id
          }
        },
      });
      if (!gradeExists) {
        return {
          message: 'El curso especificado no existe.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const teacherExists = await this.teacherRepository.findOne({
        where: {
          id: createSubjectDto.teacher,
          isActive: 'ACTIVE',
          school: {
            id: userAuth.id
          }
        },
      });
      if (!teacherExists) {
        return {
          message: 'El profesor especificado no existe.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const newSubject = await this.subjectRepository.save({
        name: createSubjectDto.name.trim(),
        grade: gradeExists,
        teacher: teacherExists,
        school: { id: userAuth.id }
      });

      return {
        message: 'Asignatura creada.',
        status: HttpStatus.CREATED,
        icon: 'success',
        data: newSubject
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear la asignatura',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  findAll() {
    return `This action returns all subjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
