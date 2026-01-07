import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';
import { UsersModule } from 'src/users/users.module';
import { Grade } from 'src/grades/entities/grade.entity';
import { StudentsController } from './students.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Student, Grade])
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
