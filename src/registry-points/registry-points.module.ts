import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { RegistryPoint } from './entities/registry-point.entity';
import { RegistryPointsService } from './registry-points.service';
import { RegistryPointsController } from './registry-points.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RegistryPoint])
  ],
  controllers: [RegistryPointsController],
  providers: [RegistryPointsService],
})
export class RegistryPointsModule {}
