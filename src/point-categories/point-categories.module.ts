import { Module } from '@nestjs/common';
import { PointCategoriesService } from './point-categories.service';
import { PointCategoriesController } from './point-categories.controller';

@Module({
  controllers: [PointCategoriesController],
  providers: [PointCategoriesService],
})
export class PointCategoriesModule {}
