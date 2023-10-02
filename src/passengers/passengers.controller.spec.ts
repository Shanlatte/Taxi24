import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './passengers.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { GetPassengerDto } from './dto/get-passenger.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '../persons/entities/person.entity';
import { Repository } from 'typeorm';

const passengersDto: GetPassengerDto[] = [{ id: 1, name: 'Passenger1', email: 'passenger1@gmail.com' }, { id: 2, name: 'Passenger2', email: 'passenger2@gmail.com' }]


class PersonRepositoryMock {
  findOne() {
    return Promise.resolve({})
  }
  // Implementa los métodos necesarios simulados para tus pruebas
}

// PassengersService Mock
class PassengersServiceMock {
  create(createPassengerDto: CreatePassengerDto) {
    return { id: 1, ...createPassengerDto };
  }

  findAll() {
    return passengersDto;
  }

  findOneById(id: number) {
    if (id === 1) {
      return passengersDto[0];
    } else {
      throw new NotFoundException(`No passenger was found with this ID`);
    }
  }
}

describe('PassengersController', () => {
  let controller: PassengersController;
  let service: PassengersService;
  let personRepository: Repository<Person>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengersController],
      providers: [
        {
          provide: PassengersService,
          useClass: PassengersServiceMock, // PassengersService mock
        },
        {
          provide: getRepositoryToken(Person),
          useClass: PersonRepositoryMock, // PersonRepository mock
        },
      ],
    }).compile();

    controller = module.get<PassengersController>(PassengersController);
    service = module.get<PassengersService>(PassengersService);
    personRepository = module.get<Repository<Person>>(getRepositoryToken(Person));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createPassengerDto: CreatePassengerDto = {
      name: 'Passenger1',
      email: 'passenger1@gmail.com',
    };

    it('should create a passenger', () => {
      const result = controller.create(createPassengerDto);
      expect(result).toEqual({ id: 1, ...createPassengerDto });
    });

  });

  describe('findAll', () => {
    it('should return an array of passengers', () => {
      const result = controller.findAll();
      expect(result).toEqual(passengersDto);
    });
  });

  describe('findOneById', () => {
    it('should return a passenger by ID', () => {
      const result = controller.findOneById('1');
      expect(result).toEqual(passengersDto[0]);
    });

    it('should throw NotFoundException if passenger not found', () => {
      expect(() => controller.findOneById('99')).toThrow(NotFoundException);
    });
  });
});