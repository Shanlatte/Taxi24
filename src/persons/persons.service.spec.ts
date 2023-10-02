import { Test, TestingModule } from '@nestjs/testing';
import { PersonsService } from './persons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';

// Mock del Repositorio de TypeORM
const personRepositoryMock = {
  create: jest.fn(),
  save: jest.fn(),
};

describe('PersonsService', () => {
  let service: PersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonsService,
        {
          provide: getRepositoryToken(Person),
          useValue: personRepositoryMock as unknown as Repository<Person>,
        },
      ],
    }).compile();

    service = module.get<PersonsService>(PersonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a person', async () => {
      const createPersonDto: CreatePersonDto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const createdPerson: Person = {
        id: 1,
        ...createPersonDto,
      };

      personRepositoryMock.create.mockReturnValue(createdPerson);
      personRepositoryMock.save.mockResolvedValue(createdPerson);

      const result = await service.create(createPersonDto);

      expect(personRepositoryMock.create).toHaveBeenCalledWith(createPersonDto);
      expect(personRepositoryMock.save).toHaveBeenCalledWith(createdPerson);
      expect(result).toEqual(createdPerson);
    });
  });
});
