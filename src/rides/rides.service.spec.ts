import { Test, TestingModule } from '@nestjs/testing';
import { RidesService } from './rides.service';
import { EntityManagerMock, RepositoryMock } from '../utils/testUtils';
import { NotFoundException } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { Ride } from './entities/ride.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { Passenger } from '../passengers/entities/passenger.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GetRideDto } from './dto/get-ride.dto';
import { Location } from '../locations/entities/location.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

const createRide: CreateRideDto = {
  passengerId: 1,
  driverId: 1,
  startLatitude: 40.7128,
  startLongitude: -74.0060,
  endLatitude: 40.7128,
  endLongitude: -74.0060,
}

const ridesResultDTO: GetRideDto[] = [
  {
    id: 1,
    passengerId: 1,
    driverId: 1,
    startLocationId: 1,
    endLocationId: 1,
    status: 'active',
  }
];

const ridesData: Ride[] = [
  {
    id: 1,
    driver: {
      id: 1, person: { id: 1, name: 'Driver1', email: 'driver1@gmail.com' },
      location: { id: 1, latitude: 40.7128, longitude: -74.0060 },
      available: false
    },
    passenger: { id: 1, person: { id: 2, name: 'Passenger1', email: 'passenger1@gmail.com' } },
    startLocation: { id: 1, latitude: 40.7128, longitude: -74.0060 },
    endLocation: { id: 1, latitude: 40.7128, longitude: -74.0060 },
    status: 'active',
  },
]

describe('RidesService', () => {
  let service: RidesService;
  let rideRepository: RepositoryMock<Ride>;
  let driverRepository: RepositoryMock<Driver>;
  let passengerRepository: RepositoryMock<Passenger>;
  let locationRepository: RepositoryMock<Location>;
  let invoiceRepository: RepositoryMock<Invoice>;
  let entityManager: EntityManagerMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RidesService,
        {
          provide: getRepositoryToken(Ride),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Driver),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Passenger),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Location),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Invoice),
          useClass: RepositoryMock,
        },
        {
          provide: EntityManager,
          useClass: EntityManagerMock,
        },
      ],
    }).compile();

    service = module.get<RidesService>(RidesService);
    rideRepository = module.get<RepositoryMock<Ride>>(getRepositoryToken(Ride));
    driverRepository = module.get<RepositoryMock<Driver>>(getRepositoryToken(Driver));
    passengerRepository = module.get<RepositoryMock<Passenger>>(getRepositoryToken(Passenger));
    locationRepository = module.get<RepositoryMock<Location>>(getRepositoryToken(Location));
    invoiceRepository = module.get<RepositoryMock<Invoice>>(getRepositoryToken(Invoice));
    entityManager = module.get<EntityManagerMock>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('create', () => {
  //   const createRideDto: CreateRideDto = createRide;

  //   it('should create a ride', async () => {
  //     const result = await service.create(createRideDto);
  //     const expectedResult: GetRideDto = ridesResultDTO[0];
  //     expect(result).toEqual(expectedResult);
  //   });

  //   it('should throw InternalServerErrorException if an error occurs during creation', async () => {
  //     jest.spyOn(entityManager, 'save').mockRejectedValue(new Error('Some error'));
  //     await expect(service.create(createRideDto)).rejects.toThrowError(InternalServerErrorException);
  //   });
  // });

  describe('findAll', () => {
    it('should return an array of rides', async () => {
      rideRepository.data = ridesData;
      const result = await service.findAll();
      const expectedResult: GetRideDto[] = ridesResultDTO;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllActive', () => {
    it('should return an array of active rides', async () => {
      rideRepository.data = ridesData;
      const result = await service.findAllActive();
      const expectedResult: GetRideDto[] = ridesResultDTO;
      expect(result).toEqual(expectedResult);
    });
  });

  // describe('completeRide', () => {
  //   it('should complete a ride by ID', async () => {
  //     const result = await service.completeRide(1);
  //     expect(result).toEqual(/* Resultado esperado */);
  //   });

  //   it('should throw NotFoundException if ride not found', async () => {
  //     await expect(service.completeRide(99)).rejects.toThrowError(NotFoundException);
  //   });
  // });

  describe('findOneById', () => {
    it('should return a ride by ID', async () => {
      rideRepository.data = ridesData
      const result = await service.findOneById(1);
      expect(result).toEqual(ridesResultDTO[0]);
    });

    it('should throw NotFoundException if ride not found', async () => {
      await expect(service.findOneById(99)).rejects.toThrowError(NotFoundException);
    });

  });

});