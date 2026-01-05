import { Like, Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService
  ){}

  async create(createSchoolDto: CreateSchoolDto) {
    try {
      const schoolByName = await this.schoolRepository.findOneBy({ name: createSchoolDto.name });
      if (schoolByName) {
        return {
          message: 'Por favor, elija otro nombre.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
          errors: [`El nombre (${createSchoolDto.name}), ya está en uso.`]
        };
      };

      const newSchool = await this.schoolRepository.save(createSchoolDto);

      return {
        message: 'Curso creado.',
        status: HttpStatus.CREATED,
        icon: 'success',
        errors: [],
        data: newSchool
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear el colegio',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all schools`;
  }

  findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto, user: JwtPayload) {
    try {
      //Usuario autenticado
      const userAuth = await this.userService.findByEmail(user.email);
      if (!userAuth) {
        return {
          message: 'No está autorizado.',
          status: HttpStatus.UNAUTHORIZED,
          icon: 'error',
          errors: []
        };
      };

      const schoolExist = await this.schoolRepository.findOneBy({ id, isActive: 'ACTIVE'});
      if (!schoolExist) {
        return {
          message: 'El colegio no existe.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const schoolNameExist = await this.schoolRepository.findOneBy({ name: updateSchoolDto.name?.trim(), isActive: 'ACTIVE'});
      if (schoolNameExist && schoolNameExist.id !== id) {
        return {
          message: 'Por favor, elija otro nombre.',
          status: HttpStatus.CONFLICT,
          icon: 'error',
          errors: [`El nombre (${updateSchoolDto.name}), ya está en uso.`]
        };
      };

      await this.schoolRepository.update(id, { name: updateSchoolDto.name?.trim() });
      return {
        message: 'Colegio actualizado.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al actualizar el colegio',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
