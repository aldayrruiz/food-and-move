import { Test, TestingModule } from '@nestjs/testing';
import { ConsultsController } from './consults.controller';
import { ConsultsService } from './consults.service';

describe('ConsultsController', () => {
  let controller: ConsultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultsController],
      providers: [ConsultsService],
    }).compile();

    controller = module.get<ConsultsController>(ConsultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
