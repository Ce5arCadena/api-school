import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { PointCategory } from './entities/point-category.entity';
import { CreatePointCategoryDto } from './dto/create-point-category.dto';
import { UpdatePointCategoryDto } from './dto/update-point-category.dto';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class PointCategoriesService {
  constructor(
    @InjectRepository(PointCategory)
    private pointCategoryRepository: Repository<PointCategory>,

    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,

    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    private usersService: UsersService
  ) {}

  async create(createPointCategoryDto: CreatePointCategoryDto, user: JwtPayload) {
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
      
      const teacherData = await this.teacherRepository.findOneBy({ id: userAuth.id, school: { id: userAuth.school.id } });
      const existSubject = await this.subjectRepository.findOne({
        where: {
          id: createPointCategoryDto.subject,
          isActive: 'ACTIVE',
          school: {
            id: userAuth.school.id
          },
          teacher: {
            id: teacherData?.id
          }
        }
      });
      if (!existSubject) {
        return {
          message: 'La asignatura especificada no existe.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const existCategory = await this.pointCategoryRepository.findOne({
        where: {
          name: createPointCategoryDto.name,
          school: {
            id: userAuth.school.id
          },
          subject: {
            id: existSubject.id
          },
          isActive: 'ACTIVE'
        }
      });
      if (existCategory) {
        return {
          message: 'Ya existe una categoria de puntos con el mismo nombre. Elija otro.',
          status: HttpStatus.CONFLICT,
          icon: 'error',
        };
      };

      const newPointCategory = await this.pointCategoryRepository.save({
        name: createPointCategoryDto.name.trim(),
        maxPoints: createPointCategoryDto.maxPoints,
        subject: existSubject,
        school: { id: userAuth.school.id }
      });

      return {
        message: 'Categoria de puntos creada.',
        status: HttpStatus.CREATED,
        icon: 'success',
        data: {
          pointCategory: newPointCategory
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear la categoria de puntos.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  findAll() {
    return `This action returns all pointCategories`;
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

      const existCategory = await this.pointCategoryRepository.findOne({
        where: {
          id,
          school: {
            id: userAuth.school.id
          },
          isActive: 'ACTIVE'
        },
        relations: ['subject', 'registryPoints']
      });
      if (!existCategory) {
        return {
          message: 'No existe la categoria de puntos especificada.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      return {
        message: 'Asignatura encontrada.',
        status: HttpStatus.OK,
        icon: 'success',
        data: {
          existCategory
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al obtener la categoria de puntos.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }

  async update(id: number, updatePointCategoryDto: UpdatePointCategoryDto, user: JwtPayload) {
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

      const pointCategory = await this.pointCategoryRepository.findOne({
        where: {
          id,
          school: {
            id: userAuth.school.id
          },
          isActive: 'ACTIVE'
        },
        relations: ['subject']
      });
      if (!pointCategory) {
        return {
          message: 'No existe la categoria de puntos especificada.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      const updatePointCategory: Partial<PointCategory> = {};
      if (updatePointCategoryDto.name) {
        const categoryPointByName = await this.pointCategoryRepository.findOne({
          where: {
            name: updatePointCategoryDto.name,
            school: {
              id: userAuth.school.id
            },
            subject: {
              id: pointCategory.subject.id
            },
          }
        });
        if (categoryPointByName && categoryPointByName.id !== id) {
          return {
            message: 'Ya existe una categoria de puntos con el mismo nombre. Elija otro.',
            status: HttpStatus.CONFLICT,
            icon: 'error',
          };
        };
        updatePointCategory.name = updatePointCategoryDto.name.trim();  
      };

      if (updatePointCategoryDto.maxPoints && Number(updatePointCategoryDto.maxPoints) < Number(pointCategory.maxPoints)) {
        return {
          message: 'No se puede asignar menos puntos máximos.',
          status: HttpStatus.BAD_REQUEST,
          icon: 'error',
        };
      } else if (updatePointCategoryDto.maxPoints && Number(updatePointCategoryDto.maxPoints) >= Number(pointCategory.maxPoints)) {
        updatePointCategory.maxPoints = updatePointCategory.maxPoints;
      };

      if (updatePointCategoryDto.subject) {
        const teacherData = await this.teacherRepository.findOneBy({ user: { id: userAuth.id }, school: { id: userAuth.school.id } });
        const existSubject = await this.subjectRepository.findOne({
          where: {
            id: updatePointCategoryDto.subject,
            isActive: 'ACTIVE',
            school: {
              id: userAuth.school.id
            },
            teacher: {
              id: teacherData?.id
            }
          }
        });
        if (!existSubject) {
          return {
            message: 'La asignatura especificada no existe.',
            status: HttpStatus.NOT_FOUND,
            icon: 'error',
          };
        };
        updatePointCategory.subject = existSubject;
      };

      await this.pointCategoryRepository.update(id, updatePointCategory);
      return {
        message: 'Categoria de puntos actualizada.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      console.log(error)
      throw new HttpException({
        message: 'Error al actualizar la categoria de puntos.',
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

      const existCategory = await this.pointCategoryRepository.findOne({
        where: {
          id,
          school: {
            id: userAuth.school.id
          },
          isActive: 'ACTIVE'
        }
      });
      if (!existCategory) {
        return {
          message: 'No existe la categoria de puntos especificada.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
        };
      };

      await this.pointCategoryRepository.update({
        id,
        school: {
          id: userAuth.school.id
        },
        isActive: 'ACTIVE'
      }, {
        isActive: 'INACTIVE'
      });
      return {
        message: 'Categoria de puntos eliminada.',
        status: HttpStatus.OK,
        icon: 'success',
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al eliminar la categoria de puntos.',
        icon: 'error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    };
  }
}
