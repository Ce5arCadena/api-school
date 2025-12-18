import { Repository } from 'typeorm';
import bcrypt from 'node_modules/bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { SchoolsService } from 'src/schools/schools.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private schoolService: SchoolsService
  ) {}

  async createSuper(createUserDto: CreateUserDto, rol: UserRole) {
    try {
      const [user, total] = await this.userRepository.findAndCount({
        where: { rol: UserRole.SUPERADMIN}
      });

      if (total >= 1) {
        return {
          message: 'No está permitido para ejecutar esta acción.',
          status: HttpStatus.CONFLICT,
          icon: 'error',
          errors: []
        };
      };

      const passwordHash = await bcrypt.hash(createUserDto.password, 12);
      const saveUser = await this.userRepository.save({...createUserDto, rol, password: passwordHash});
      const userSerialize = plainToInstance(User, saveUser);

      return {
        message: 'Super admin creado.',
        status: HttpStatus.CREATED,
        icon: 'success',
        errors: [],
        data: userSerialize
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear el recurso',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createUserDto: CreateUserDto, rol: UserRole, user: JwtPayload) {
    try {
      //Usuario autenticado
      const userAuth = await this.findByEmail(user.email);

      let userExist: User | null = null;
      const conditions = {
        email: createUserDto.email
      };

      if (rol === UserRole.TEACHER || rol === UserRole.STUDENT) conditions['school'] = userAuth?.id;

      userExist = await this.userRepository.findOneBy(conditions);
      if (userExist) {
        return {
          message: 'Por favor, elija otro correo.',
          status: HttpStatus.CONFLICT,
          icon: 'error',
          errors: [`El correo (${createUserDto.email}), ya está en uso.`]
        };
      };

      const passwordHash = await bcrypt.hash(createUserDto.password, 12);

      if (rol === UserRole.SCHOOL) {
        const saveUser = await this.userRepository.save({ ...createUserDto, rol, password: passwordHash });
        await this.schoolService.create({id: saveUser.id, name: createUserDto.name, user: saveUser });
        const userSerialize = plainToInstance(User, saveUser);

        return {
          message: 'Colegio creado.',
          status: HttpStatus.CREATED,
          icon: 'success',
          errors: [],
          data: userSerialize
        };
      } else {
        //TODO: lógica de guardado de profesores
      }
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear el recurso',
        icon: 'error',
        errors: [error],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // Busca un usuario por email.
  async findByEmail(email: string): Promise<User | null> {
    try {
      return this.userRepository.findOneBy({email});
    } catch (error) {
      throw new HttpException({
        message: 'Error al consultar el usuario',
        icon: 'error',
        errors: [error],
        status: HttpStatus.UNAUTHORIZED,
      }, HttpStatus.UNAUTHORIZED);
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
