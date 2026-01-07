import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { UsersService } from 'src/users/users.service';
import { Grade } from 'src/grades/entities/grade.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryParamsBase } from 'src/utils/dtos';

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

      const existStudentByDocument = await this.studentsRepository.findOne({
        where: {
          document: createStudentDto.document.trim(),
          school: {
            id: userAuth.id
          },
          grade: {
            id: createStudentDto.grade
          },
          isActive: 'ACTIVE'
        }
      });
      if (existStudentByDocument) {
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

      const query = this.studentsRepository.createQueryBuilder('student')
        .where('student.isActive = :status', { status: 'ACTIVE'})
        .andWhere('student.schoolId = :schoolId', { schoolId: userAuth.id });

      if (params.search) {
        query.andWhere(
          `(student.name LIKE :search
          OR student.lastname LIKE :search
          OR student.document LIKE :search
          OR student.phone LIKE :search
          )`,
          { search: `%${params.search.trim()}%`}
        )
      };

      const [students, totalStudents] = await query.orderBy('student.created', 'ASC')
        .skip(params.offset)
        .take(params.limit)
        .leftJoinAndSelect('student.grade', 'grade')
        .leftJoinAndSelect('student.school', 'school')
        .getManyAndCount();

      return {
        message: 'Lista de estudiantes.',
        status: HttpStatus.OK,
        icon: 'success',
        data: {
          students,
          total: totalStudents
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al listar los estudiantes.',
        icon: 'error',
        errors: [error],
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

      const student = await this.studentsRepository.findOne({
        where: { 
          id, 
          school: { id: userAuth.id }, 
          isActive: 'ACTIVE' 
        },
        relations: ['grade', 'school']
      });
      if (!student) {
        return {
          message: 'No existe el estudiante especificado.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      return {
        message: 'Estudiante encontrado.',
        status: HttpStatus.OK,
        icon: 'success',
        data: {
          student
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al obtener el estudiante.',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  async update(id: number, updateStudentDto: UpdateStudentDto, user: JwtPayload) {
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

      const student = await this.studentsRepository.findOneBy({ id, school: { id: userAuth.id }, isActive: 'ACTIVE'});
      if (!student) {
        return {
          message: 'No existe el estudiante especificado.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const updateData: Partial<Student> = {};
      if (updateStudentDto.grade) {
        const gradeExist = await this.gradeRepository.findOneBy({ id: updateStudentDto.grade, school: { id: userAuth.id }, isActive: 'ACTIVE' });
        if (!gradeExist) {
          return {
            message: 'No existe el grado especificado',
            status: HttpStatus.NOT_FOUND,
            icon: 'error',
          };
        };
        updateData.grade = gradeExist;
      };
      if (updateStudentDto.name) updateData.name = updateStudentDto.name.trim();
      if (updateStudentDto.lastname) updateData.lastname = updateStudentDto.lastname.trim();
      if (updateStudentDto.document) {
        const existStudentByDocument = await this.studentsRepository.findOne({
          where: {
            document: updateStudentDto.document.trim(),
            school: {
              id: userAuth.id
            },
            isActive: 'ACTIVE'
          }
        });

        if (existStudentByDocument && existStudentByDocument.id !== id) {
          return {
            message: 'Ya existe un estudiante con el mismo documento en el mismo grado',
            status: HttpStatus.CONFLICT,
            icon: 'error',
          };
        };

        updateData.document = updateStudentDto.document.trim();
      };
      if (updateStudentDto.phone) updateData.phone = updateStudentDto.phone.trim();

      await this.studentsRepository.update(id, updateData);
      return {
        message: 'Estudiante actualizado.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al actualizar el estudiante.',
        icon: 'error',
        errors: [error],
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

      const student = await this.studentsRepository.findOneBy({ id, school: { id: userAuth.id }, isActive: 'ACTIVE'});
      if (!student) {
        return {
          message: 'No existe el estudiante especificado.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      await this.studentsRepository.update(id, { isActive: 'INACTIVE' });
      return {
        message: 'Estudiante eliminado.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al eliminar el estudiante.',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }
}
