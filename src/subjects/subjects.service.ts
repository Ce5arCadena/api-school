import { Repository } from 'typeorm';
import { QueryParamsBase } from 'src/utils/dtos';
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

  async findAll(params: QueryParamsBase, user: JwtPayload) {
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

      const querySubjects = this.subjectRepository.createQueryBuilder('subject')
        .where('subject.isActive = :isActive', { isActive: 'ACTIVE' })
        .andWhere('subject.schoolId = :schoolId', { schoolId: userAuth.id });

      if (params.search) {
        querySubjects.andWhere(
          `(
            subject.name LIKE :search
          )`,
          { search: `%${params.search.trim()}%`}
        );
      };

      const [subjects, totalSubjects] = await querySubjects.orderBy('subject.created', 'ASC')
        .skip(params.offset)
        .take(params.limit)
        .leftJoinAndSelect('subject.grade', 'grade')
        .leftJoinAndSelect('subject.teacher', 'teacher')
        .getManyAndCount();

      return {
        message: 'Lista de asignaturas.',
        status: HttpStatus.OK,
        icon: 'success',
        data: {
          subjects,
          total: totalSubjects
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al listar las asignaturas.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  async findOne(id: number, user: JwtPayload) {
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

      const subject = await this.subjectRepository.findOne({
        where: { id, school: { id: userAuth.id }, isActive: 'ACTIVE' },
        relations: ['grade', 'teacher']
      });
      if (!subject) {
        return {
          message: 'La asignatura especificada no existe.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      return {
        message: 'Asignatura encontrada.',
        status: HttpStatus.OK,
        icon: 'success',
        data: {
          subject
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al obtener la asignatura.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto, user: JwtPayload) {
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

      const subject = await this.subjectRepository.findOneBy({ id, school: { id: userAuth.id }, isActive: 'ACTIVE' });
      if (!subject) {
        return {
          message: 'La asignatura especificada no existe.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const dataUpdate: Partial<Subject> = {};
      if (updateSubjectDto.name) {
        const subjectByName = await this.subjectRepository.findOneBy({ name: updateSubjectDto.name, school: { id: userAuth.id }, isActive: 'ACTIVE' });
        if (subjectByName && subjectByName.id !== subject.id) {
          return {
            message: 'Ya existe una materia con el mismo nombre',
            status: HttpStatus.CONFLICT,
            icon: 'error',
          };
        };
        dataUpdate.name = updateSubjectDto.name.trim();
      };

      if (updateSubjectDto.grade) {
        const gradeExists = await this.gradeRepository.findOne({
          where: {
            id: updateSubjectDto.grade,
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
        dataUpdate.grade = gradeExists;
      };

      if (updateSubjectDto.teacher) {
        const teacherExists = await this.teacherRepository.findOne({
          where: {
            id: updateSubjectDto.teacher,
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
        dataUpdate.teacher = teacherExists;
      };

      await this.subjectRepository.update(id, dataUpdate);
      return {
        message: 'Asignatura actualizada.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al actualizar la asignatura',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  async remove(id: number, user: JwtPayload) {
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

      const subject = await this.subjectRepository.findOne({
        where: { id, school: { id: userAuth.id }, isActive: 'ACTIVE' },
      });
      if (!subject) {
        return {
          message: 'La asignatura especificada no existe.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      await this.subjectRepository.update(id, { isActive: 'INACTIVE' });
      return {
        message: 'Asignatura eliminada.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al eliminar la asignatura.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }
}
