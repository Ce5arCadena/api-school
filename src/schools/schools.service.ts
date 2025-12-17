import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>
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
      console.log(createSchoolDto)

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

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
