import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Grade } from 'src/grades/entities/grade.entity';
import { Student } from 'src/students/entities/student.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { RegistryPoint } from './entities/registry-point.entity';
import { RegistryPointsService } from './registry-points.service';
import { RegistryPointsController } from './registry-points.controller';
import { PointCategory } from 'src/point-categories/entities/point-category.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RegistryPoint, PointCategory, Student, Subject, Grade, Teacher])
  ],
  controllers: [RegistryPointsController],
  providers: [RegistryPointsService],
})
export class RegistryPointsModule {}
