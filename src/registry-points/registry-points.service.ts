import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { Student } from 'src/students/entities/student.entity';
import { RegistryPoint } from './entities/registry-point.entity';
import { CreateRegistryPointDto } from './dto/create-registry-point.dto';
import { UpdateRegistryPointDto } from './dto/update-registry-point.dto';
import { PointCategory } from 'src/point-categories/entities/point-category.entity';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Subject } from 'src/subjects/entities/subject.entity';

@Injectable()
export class RegistryPointsService {
  constructor(
    @InjectRepository(RegistryPoint)
    private registryPointRepository: Repository<RegistryPoint>,

    @InjectRepository(PointCategory)
    private pointCategoryRepository: Repository<PointCategory>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,

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
          status: HttpStatus.NOT_FOUND,
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
      console.log(error)
      throw new HttpException({
        message: 'Error al registrar los puntos.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  findAll() {
    return `This action returns all registryPoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registryPoint`;
  }

  update(id: number, updateRegistryPointDto: UpdateRegistryPointDto) {
    return `This action updates a #${id} registryPoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} registryPoint`;
  }
}
