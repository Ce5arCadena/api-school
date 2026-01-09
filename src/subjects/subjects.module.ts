import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { UsersModule } from 'src/users/users.module';
import { SubjectsService } from './subjects.service';
import { Grade } from 'src/grades/entities/grade.entity';
import { SubjectsController } from './subjects.controller';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, Grade, Teacher]),
    UsersModule
  ],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
