import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { GradesModule } from './grades/grades.module';
import { Grade } from './grades/entities/grade.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'school',
      entities: [Grade],
      synchronize: true
    }),
    GradesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
