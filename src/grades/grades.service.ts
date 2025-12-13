import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade) 
    private gradeRepository: Repository<Grade>
  ) {}

  async create(createGradeDto: CreateGradeDto) {
    try {
      const grade = await this.gradeRepository.save(createGradeDto);

      return {
        message: 'Curso creado.',
        status: HttpStatus.CREATED,
        icon: 'success',
        errors: [],
        data: grade
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear el curso',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  findAll() {
    return `This action returns all grades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grade`;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    try {
      const grade = await this.gradeRepository.findOneBy({ id });
      if (!grade) {
        return {
          message: 'No se encontró el curso.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
          errors: [`El recurso especificado (${id}), no se encontró`]
        };
      };

    } catch (error) {
      throw new HttpException({
        message: 'Error al actualizar el curso',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  remove(id: number) {
    return `This action removes a #${id} grade`;
  }
}
