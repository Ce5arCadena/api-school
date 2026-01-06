import { Like, Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolQuery } from 'src/utils/interfaces';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { ParamsSchoolDto } from './dto/params-school.dto';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

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

  async findAll(params: ParamsSchoolDto, user: JwtPayload) {
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

      const conditions: SchoolQuery = {
        isActive: 'ACTIVE',
      }

      if (params.search) conditions.name = Like(`%${params.search.trim()}%`);

      const [schools, totalSchools] = await this.schoolRepository.findAndCount({
        where: conditions,
        skip: params.offset,
        take: params.limit,
        relations: ['user']
      });

      const schoolsFormat = plainToInstance(User, schools);

      return {
        message: 'Lista de colegios.',
        status: HttpStatus.OK,
        icon: 'success',
        data: {
          schools: schoolsFormat,
          total: totalSchools
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al listar los colegios',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  async findOne(id: number, user: JwtPayload) {
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

      const schoolExist = await this.schoolRepository.findOne({
        where: { 
          id, 
          isActive: 'ACTIVE'
        },
        relations: ['user']
      });
      if (!schoolExist) {
        return {
          message: 'El colegio no existe.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const formatSchool = plainToInstance(User, schoolExist);

      return {
        message: 'Colegio encontrado.',
        status: HttpStatus.OK,
        icon: 'success',
        data: {
          schools: formatSchool,
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al obtener el colegio',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
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

  async remove(id: number, user: JwtPayload) {
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

      const schoolExist = await this.schoolRepository.findOneBy({ id, isActive: 'ACTIVE' });
      if (!schoolExist) {
        return {
          message: 'El colegio no existe.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      await this.schoolRepository.update({ id }, { isActive: 'INACTIVE' });
      return {
        message: 'Colegio eliminado.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al eliminar el colegio',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }
}
