import { Test, TestingModule } from '@nestjs/testing';
import { ConsultsService } from './consults.service';

describe('ConsultsService', () => {
  let service: ConsultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultsService],
    }).compile();

    service = module.get<ConsultsService>(ConsultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
