import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { GradesModule } from './grades/grades.module';
import { Grade } from './grades/entities/grade.entity';
import { SchoolsModule } from './schools/schools.module';
import { School } from './schools/entities/school.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'school',
      entities: [Grade, School, User],
      synchronize: true
    }),
    GradesModule,
    SchoolsModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
