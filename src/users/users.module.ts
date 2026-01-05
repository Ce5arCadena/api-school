import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersController } from './users.controller';
import { SchoolsModule } from 'src/schools/schools.module';

@Module({
  imports: [
    forwardRef(() => SchoolsModule),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  exports: [UsersService]
})
export class UsersModule {}
