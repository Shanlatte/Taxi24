import { Test, TestingModule } from '@nestjs/testing';
import { DriversService } from './drivers.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '../persons/entities/person.entity';
import { EntityManager } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { GetDriverDto } from './dto/get-driver.dto';
import { Driver } from './entities/driver.entity';
import { Location } from '../locations/entities/location.entity';
import { RepositoryMock, EntityManagerMock } from '../utils/testUtils';

const driversResultDTO: GetDriverDto[] = [
  {
    id: 1,
    name: 'Driver1',
    email: 'driver1@gmail.com',
    latitude: 40.7128,
    longitude: -74.0060,
    available: true,
  },
];

const driversData: Driver[] = [
  {
    id: 1,
    person: { id: 1, name: 'Driver1', email: 'driver1@gmail.com' },
    location: { id: 1, latitude: 40.7128, longitude: -74.0060 },
    available: true,
  },
]

describe('DriversService', () => {
  let service: DriversService;
  let driverRepository: RepositoryMock<Driver>;
  let personRepository: RepositoryMock<Person>;
  let locationRepository: RepositoryMock<Location>;
  let entityManager: EntityManagerMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriversService,
        {
          provide: getRepositoryToken(Driver),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Person),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Location),
          useClass: RepositoryMock,
        },
        {
          provide: EntityManager,
          useClass: EntityManagerMock,
        },
      ],
    }).compile();

    service = module.get<DriversService>(DriversService);
    driverRepository = module.get<RepositoryMock<Driver>>(getRepositoryToken(Driver));
    personRepository = module.get<RepositoryMock<Person>>(getRepositoryToken(Person));
    locationRepository = module.get<RepositoryMock<Location>>(getRepositoryToken(Location));
    entityManager = module.get<EntityManagerMock>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDriverDto: CreateDriverDto = driversResultDTO[0];

    it('should create a driver', async () => {
      const result = await service.create(createDriverDto);
      const expectedResult: GetDriverDto = driversResultDTO[0];
      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException if an error occurs during creation', async () => {
      jest.spyOn(entityManager, 'save').mockRejectedValue(new Error('Some error'));
      await expect(service.create(createDriverDto)).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return an array of drivers', async () => {
      driverRepository.data = driversData;

      const result = await service.findAll();
      const expectedResult: GetDriverDto[] = driversResultDTO;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllAvailable', () => {
    it('should return an array of available drivers', async () => {
      driverRepository.data = driversData;

      const result = await service.findAllAvailable();
      const expectedResult: GetDriverDto[] = driversResultDTO;

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllAvailableIn3km', () => {
    it('should return an array of available drivers within 3km', async () => {
      driverRepository.data = driversData;

      const result = await service.findAllAvailableIn3km('40.7128', '-74.0060');
      const expectedResult: GetDriverDto[] = driversResultDTO;

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if no drivers are found', async () => {
      driverRepository.data = [];

      await expect(service.findAllAvailableIn3km('40.7128', '-74.0060')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('find3NearestDrivers', () => {
    it('should return an array of the 3 nearest drivers', async () => {
      driverRepository.data = driversData;

      const result = await service.find3NearestDrivers('40.7128', '-74.0060');
      const expectedResult: GetDriverDto[] = driversResultDTO;

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if no drivers are found', async () => {
      driverRepository.data = [];

      await expect(service.find3NearestDrivers('40.7128', '-74.0060')).rejects.toThrowError(NotFoundException);
    });
  });


});
