import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { PointCategory } from './entities/point-category.entity';
import { PointCategoriesService } from './point-categories.service';
import { PointCategoriesController } from './point-categories.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([PointCategory, Subject, Teacher])
  ],
  controllers: [PointCategoriesController],
  providers: [PointCategoriesService],
})
export class PointCategoriesModule {}
