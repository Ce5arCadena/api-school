import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { GradesService } from './grades.service';
import { UsersModule } from 'src/users/users.module';
import { GradesController } from './grades.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grade]),
    UsersModule
  ],
  exports: [TypeOrmModule],
  providers: [GradesService],
  controllers: [GradesController],
})
export class GradesModule {}
