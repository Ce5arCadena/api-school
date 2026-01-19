import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FindAllRegistryPoints } from 'src/utils/dtos';
import { Grade } from 'src/grades/entities/grade.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { Student } from 'src/students/entities/student.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { RegistryPoint } from './entities/registry-point.entity';
import { CreateRegistryPointDto } from './dto/create-registry-point.dto';
import { UpdateRegistryPointDto } from './dto/update-registry-point.dto';
import { PointCategory } from 'src/point-categories/entities/point-category.entity';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RegistryPointsService {
  constructor(
    @InjectRepository(RegistryPoint)
    private registryPointRepository: Repository<RegistryPoint>,

    @InjectRepository(PointCategory)
    private pointCategoryRepository: Repository<PointCategory>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,

    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,

    private usersService: UsersService
  ){}

  async create(createRegistryPointDto: CreateRegistryPointDto, user: JwtPayload) {
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

      const categoryPoints = await this.pointCategoryRepository.findOne({
        where: {
          school: {
            id: userAuth.school.id
          },
          id: createRegistryPointDto.pointCategory
        },
        relations: ['subject']
      });
      if (!categoryPoints) {
        return {
          message: 'No existe la categoría de puntos especificada.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };
      if (Number(createRegistryPointDto.points) > Number(categoryPoints.maxPoints)) {
        return {
          message: `No puedes asignar más puntos de los permitidos para la categoría (${categoryPoints.maxPoints})`,
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      };

      const subject = await this.subjectRepository.findOne({
        where: {
          school: {
            id: userAuth.school.id
          },
          id: createRegistryPointDto.subject
        },
        relations: ['grade']
      });
      if (!subject) {
        return {
          message: 'No existe la matería especificada.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };
      if (subject.grade.id !== categoryPoints.subject.id) {
        return {
          message: 'La materia especificada no está relacionada con la categoría de puntos.',
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      };

      const student = await this.studentRepository.findOne({
        where: {
          school: {
            id: userAuth.school.id
          },
          id: createRegistryPointDto.student
        },
        relations: ['grade']
      });
      if (!student) {
        return {
          message: 'No existe el estudiante especificado.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };
      if (student.grade.id !== subject.grade.id) {
        return {
          message: 'El estudiante no pertenece al grupo en el que intenta registrar puntos.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      // Verifico si ya en esa categoria tiene puntos asignados, porque solo puede es actualizar el valor, no dos del mismo
      const registryPointExist = await this.registryPointRepository.findOne({
        where: {
          school: {
            id: userAuth.school.id
          },
          pointCategory: {
            id: createRegistryPointDto.pointCategory
          },
          student: {
            id: createRegistryPointDto.student
          }
        }
      });
      if (registryPointExist) {
        return {
          message: 'Solo se puede asignar una vez los puntos por categoría.',
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      };

      const newRegsitryPoints = await this.registryPointRepository.save({
        points: createRegistryPointDto.points,
        school: { id: userAuth.school.id },
        student: student,
        pointCategory: categoryPoints,
        subject: subject,
      });

      return {
        message: 'Registro de puntos éxitoso.',
        status: HttpStatus.CREATED,
        icon: 'success',
        data: newRegsitryPoints
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al registrar los puntos.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  async findAll(params: FindAllRegistryPoints, user: JwtPayload) {
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

      const teacherExists = await this.teacherRepository.findOneBy({ user: { id: userAuth.id }, school: { id: userAuth.school.id }, isActive: 'ACTIVE' });
      if (!teacherExists) {
        return {
          message: 'No tienes permiso para ejecutar esta acción',
          status: HttpStatus.UNAUTHORIZED,
          icon: 'error',
        };
      };

      const grade = await this.gradeRepository.findOne({
        where: {
          school: {
            id: userAuth.school.id
          },
          id: params.idGrade,
          isActive: 'ACTIVE'
        },
      });
      if (!grade) {
        return {
          message: 'No existe el curso especificado.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };
      const subject = await this.subjectRepository.findOne({
        where: {
          school: {
            id: userAuth.school.id
          },
          id: params.idSubject,
          teacher: {
            id: teacherExists.id
          }
        },
        relations: ['grade']
      });
      if (!subject) {
        return {
          message: 'No existe la materia especificada.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const pointsCategory = await this.pointCategoryRepository.find({
        where: {
          subject: {
            id: subject.id
          },
          isActive: 'ACTIVE',
          school: {
            id: userAuth.school.id
          },
        }
      });
      if (!pointsCategory) {
        return {
          message: 'Bebe registrar primero categorías de puntos.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const query = await this.studentRepository.createQueryBuilder('student')
        .leftJoinAndSelect('student.registryPoints', 'points', 'points.subjectId = :subjectId')
        .leftJoinAndSelect('points.pointCategory', 'pointCategory')
        .leftJoinAndSelect('points.subject', 'subject')
        .where('student.isActive = :isActive', { isActive: 'ACTIVE' })
        .andWhere('student.schoolId = :schoolId', { schoolId: userAuth.school.id })
        .setParameter('subjectId', subject.id)
        .getMany();


      return {
        message: 'Lista de Puntos de Categoría.',
        status: HttpStatus.OK,
        icon: 'success',
        data: {
          pointsCategory,
          query
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al listar los registros de puntos.',
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

      const registryPoint = await this.registryPointRepository.findOne({
        where: {
          id,
          school: {
            id: userAuth.school.id
          }
        },
        relations: ['student', 'pointCategory', 'subject']
      });
      if (!registryPoint) {
        return {
          message: 'No existe el registro especificado.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      return {
        message: 'Registro de puntos encontrado.',
        status: HttpStatus.OK,
        icon: 'success',
        data: {
          registryPoint
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al buscar el registro de puntos.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  update(id: number, updateRegistryPointDto: UpdateRegistryPointDto) {
    return `This action updates a #${id} registryPoint`;
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

      const registryPoint = await this.registryPointRepository.findOne({
        where: {
          id,
          school: {
            id: userAuth.school.id
          }
        }
      });
      if (!registryPoint) {
        return {
          message: 'No existe el registro especificado.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      await this.registryPointRepository.delete(id);
      return {
        message: 'Registro de puntos eliminado.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al eliminar el registro de puntos.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }
}
