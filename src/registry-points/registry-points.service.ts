import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { RegistryPoint } from './entities/registry-point.entity';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRegistryPointDto } from './dto/create-registry-point.dto';
import { UpdateRegistryPointDto } from './dto/update-registry-point.dto';

@Injectable()
export class RegistryPointsService {
  constructor(
    @InjectRepository(RegistryPoint)
    private registryPointRepository: Repository<RegistryPoint>,

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

      
    } catch (error) {
      throw new HttpException({
        message: 'Error al crear la categoria de puntos.',
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
