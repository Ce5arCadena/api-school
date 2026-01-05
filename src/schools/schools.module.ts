import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { SchoolsService } from './schools.service';
import { UsersModule } from 'src/users/users.module';
import { SchoolsController } from './schools.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([School])
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService]
})
export class SchoolsModule {}
