import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { GradesModule } from './grades/grades.module';
import { Grade } from './grades/entities/grade.entity';
import { SchoolsModule } from './schools/schools.module';
import { School } from './schools/entities/school.entity';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { StudentsModule } from './students/students.module';
import { Teacher } from './teachers/entities/teacher.entity';
import { Student } from './students/entities/student.entity';
import { Subject } from './subjects/entities/subject.entity';
import { RegistryPointsModule } from './registry-points/registry-points.module';
import { PointCategoriesModule } from './point-categories/point-categories.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'school',
      entities: [Grade, School, User, Teacher, Student, Subject],
      synchronize: true
    }),
    AuthModule,
    UsersModule,
    GradesModule,
    SchoolsModule,
    StudentsModule,
    TeachersModule,
    PointCategoriesModule,
    RegistryPointsModule,
    SubjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
