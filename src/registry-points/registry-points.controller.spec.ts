import { Test, TestingModule } from '@nestjs/testing';
import { RegistryPointsController } from './registry-points.controller';
import { RegistryPointsService } from './registry-points.service';

describe('RegistryPointsController', () => {
  let controller: RegistryPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistryPointsController],
      providers: [RegistryPointsService],
    }).compile();

    controller = module.get<RegistryPointsController>(RegistryPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
