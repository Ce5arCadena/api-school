import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistryPointDto } from './create-registry-point.dto';

export class UpdateRegistryPointDto extends PartialType(CreateRegistryPointDto) {}
