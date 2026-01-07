import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { UsersService } from 'src/users/users.service';
import { Grade } from 'src/grades/entities/grade.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) 
    private studentsRepository: Repository<Student>,
    
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,

    private usersService: UsersService
  ) {}

  async create(createStudentDto: CreateStudentDto, user: JwtPayload) {
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

      const gradeExist = await this.gradeRepository.findOneBy({ id: createStudentDto.grade, school: {id: userAuth.id }, isActive: 'ACTIVE' });
      if (!gradeExist) {
        return {
          message: 'No existe el grado especificado',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const findStudentByDocument = await this.studentsRepository.findOne({
        where: {
          document: createStudentDto.document,
          school: {
            id: userAuth.id
          },
          grade: {
            id: createStudentDto.grade
          },
          isActive: 'ACTIVE'
        }
      });
      if (findStudentByDocument) {
        return {
          message: 'Ya existe un estudiante con el mismo documento en el mismo grado',
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      };

      const newStudent = await this.studentsRepository.save({
        name: createStudentDto.name.trim(),
        lastname: createStudentDto.lastname.trim(),
        document: createStudentDto.document.trim(),
        phone: createStudentDto.phone.trim(),
        grade: gradeExist,
        school: { id: userAuth.id }
      });

      return {
        message: 'Estudiante creado.',
        status: HttpStatus.CREATED,
        icon: 'success',
        data: {
          student: newStudent
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear el estudiante.',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  findAll() {
    return `This action returns all students`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
