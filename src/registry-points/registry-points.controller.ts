import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistryPointsService } from './registry-points.service';
import { CreateRegistryPointDto } from './dto/create-registry-point.dto';
import { UpdateRegistryPointDto } from './dto/update-registry-point.dto';

@Controller('registry-points')
export class RegistryPointsController {
  constructor(private readonly registryPointsService: RegistryPointsService) {}

  @Post()
  create(@Body() createRegistryPointDto: CreateRegistryPointDto) {
    return this.registryPointsService.create(createRegistryPointDto);
  }

  @Get()
  findAll() {
    return this.registryPointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registryPointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistryPointDto: UpdateRegistryPointDto) {
    return this.registryPointsService.update(+id, updateRegistryPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registryPointsService.remove(+id);
  }
}
