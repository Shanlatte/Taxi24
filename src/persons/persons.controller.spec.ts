import { Test, TestingModule } from '@nestjs/testing';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';

describe('PersonsController', () => {
  let controller: PersonsController;
  let service: PersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonsController],
      providers: [
        PersonsService,
        {
          provide: getRepositoryToken(Person),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PersonsController>(PersonsController);
    service = module.get<PersonsService>(PersonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new person', async () => {
      const createPersonDto: CreatePersonDto = {
        name: 'Test',
        email: 'test@example.com',
      };

      const createdPerson = {
        id: 1,
        ...createPersonDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdPerson);

      const result = await controller.create(createPersonDto);

      expect(result).toBe(createdPerson);
    });
  });
});
