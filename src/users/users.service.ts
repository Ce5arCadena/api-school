import { Repository } from 'typeorm';
import bcrypt from 'node_modules/bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { SchoolsService } from 'src/schools/schools.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private schoolService: SchoolsService
  ) {}

  async create(createUserDto: CreateUserDto, rol: UserRole) {
    try {
      // TODO: Con la autenticación, buscar el correo por email y colegio.
      const userExist = await this.userRepository.findOneBy({ email: createUserDto.email });
      if (userExist) {
        return {
          message: 'Por favor, elija otro correo.',
          status: HttpStatus.NOT_FOUND,
          icon: 'error',
          errors: [`El correo (${createUserDto.email}), ya está en uso.`]
        };
      };

      const passwordHash = await bcrypt.hash(createUserDto.password, 12);

      if (rol === UserRole.SCHOOL) {
        const saveSchool = await this.schoolService.create({name: createUserDto.name});
        const saveUser = await this.userRepository.save({...createUserDto, rol, password: passwordHash, school: saveSchool.data});
        const userSerialize = plainToInstance(User, saveUser);

        return {
          message: 'Colegio creado.',
          status: HttpStatus.CREATED,
          icon: 'success',
          errors: [],
          data: userSerialize
        };
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
