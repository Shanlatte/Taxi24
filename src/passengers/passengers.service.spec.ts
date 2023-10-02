import { Test, TestingModule } from '@nestjs/testing';
import { PassengersService } from './passengers.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '../persons/entities/person.entity';
import { EntityManager } from 'typeorm';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { GetPassengerDto } from './dto/get-passenger.dto';
import { Passenger } from './entities/passenger.entity';


const passengersDto: GetPassengerDto[] = [{ id: 1, name: 'Passenger1', email: 'passenger1@gmail.com' }];

// Mocks
class RepositoryMock<T> {
  data: T[] = [];

  findOne(options: any) {
    return Promise.resolve(this.data.find(item => {
      for (const key in options.where) {
        if (item[key] !== options.where[key]) return false;
      }
      return true;
    }));
  }

  create(createDto: any): T {
    return { id: 1, ...createDto };
  }

  async save(entity: T) {
    this.data.push(entity);
    return Promise.resolve(entity);
  }

  find(options?: any): Promise<T[]> {
    return Promise.resolve(this.data.filter(item => {
      for (const key in options?.where) {
        if (item[key] !== options.where[key]) return false;
      }
      return true;
    }));
  }
}

class EntityManagerMock {
  transaction(callback: (entityManager) => Promise<any>) {
    return callback(this);
  }
  save() {
    return Promise.resolve({});
  }
}

describe('PassengersService', () => {
  let service: PassengersService;
  let passengerRepository: RepositoryMock<Passenger>;
  let personRepository: RepositoryMock<Person>;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengersService,
        {
          provide: getRepositoryToken(Passenger),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Person),
          useClass: RepositoryMock,
        },
        {
          provide: EntityManager,
          useClass: EntityManagerMock,
        },
      ],
    }).compile();

    service = module.get<PassengersService>(PassengersService);
    passengerRepository = module.get<RepositoryMock<Passenger>>(getRepositoryToken(Passenger));
    personRepository = module.get<RepositoryMock<Person>>(getRepositoryToken(Person));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPassengerDto: CreatePassengerDto = {
      name: 'Passenger1',
      email: 'passenger1@gmail.com',
    };

    it('should create a passenger', async () => {
      const result = await service.create(createPassengerDto);
      const expectedResult: GetPassengerDto = passengersDto[0];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of passengers', async () => {
      passengerRepository.data = [{ id: 1, person: passengersDto[0] }];
      const result = await service.findAll();
      const expectedResult: GetPassengerDto[] = passengersDto;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOneById', () => {
    it('should return a passenger by ID', async () => {
      passengerRepository.data = [{ id: 1, person: passengersDto[0] }];
      const result = await service.findOneById(1);
      const expectedResult: GetPassengerDto = passengersDto[0];
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if passenger not found', async () => {
      await expect(service.findOneById(99)).rejects.toThrowError(NotFoundException);
    });
  });
});