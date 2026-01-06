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
import { Teacher } from './teachers/entities/teacher.entity';
import { StudentsModule } from './students/students.module';

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
      entities: [Grade, School, User, Teacher],
      synchronize: true
    }),
    GradesModule,
    SchoolsModule,
    UsersModule,
    AuthModule,
    TeachersModule,
    StudentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
