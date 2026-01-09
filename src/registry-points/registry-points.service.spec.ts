import { Test, TestingModule } from '@nestjs/testing';
import { RegistryPointsService } from './registry-points.service';

describe('RegistryPointsService', () => {
  let service: RegistryPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistryPointsService],
    }).compile();

    service = module.get<RegistryPointsService>(RegistryPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
