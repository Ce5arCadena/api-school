import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher]),
    UsersModule
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
