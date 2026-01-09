import { Injectable } from '@nestjs/common';
import { CreateRegistryPointDto } from './dto/create-registry-point.dto';
import { UpdateRegistryPointDto } from './dto/update-registry-point.dto';

@Injectable()
export class RegistryPointsService {
  create(createRegistryPointDto: CreateRegistryPointDto) {
    return 'This action adds a new registryPoint';
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
