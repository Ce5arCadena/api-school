import { Module } from '@nestjs/common';
import { RegistryPointsService } from './registry-points.service';
import { RegistryPointsController } from './registry-points.controller';

@Module({
  controllers: [RegistryPointsController],
  providers: [RegistryPointsService],
})
export class RegistryPointsModule {}
