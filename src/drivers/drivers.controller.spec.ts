import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { NotFoundException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';

const drivers = [{ id: 1, name: 'Driver1', email: 'driver1@gmail.com', available: true }, { id: 2, name: 'Driver2', email: 'driver2@gmail.com', available: false }]

class DriversServiceMock {
  create(createDriverDto: CreateDriverDto) {
    return { id: 1, ...createDriverDto };
  }

  findAll() {
    return drivers;
  }

  findAllAvailable() {
    return drivers.filter(driver => driver.available === true)
  }

  findAllAvailableIn3km(latitude: string, longitude: string) {
    return [drivers[1]];
  }

  find3NearestDrivers(latitude: string, longitude: string) {
    return [drivers[0]];
  }

  findOneById(id: number) {
    if (id !== 1) {
      throw new NotFoundException('No driver was found with this ID')
    }
    return drivers[0];
  }
}

describe('DriversController', () => {
  let controller: DriversController;
  let service: DriversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [
        {
          provide: DriversService,
          useClass: DriversServiceMock, 
        },
      ],
    }).compile();

    controller = module.get<DriversController>(DriversController);
    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDriverDto: CreateDriverDto = {
      name: 'Driver1',
      email: 'driver1@gmail.com',
      latitude: -50,
      longitude: 40,
      available: true
    };

    it('should create a driver', () => {
      const result = controller.create(createDriverDto);
      expect(result).toEqual({ id: 1, ...createDriverDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of drivers', () => {
      const result = controller.findAll();
      expect(result).toEqual(drivers);
    });
  });

  describe('findAllAvailable', () => {
    it('should return an array of available drivers', () => {
      const result = controller.findAllAvailable();
      expect(result).toEqual([drivers[0]]);
    });
  });

  describe('findAllAvailableIn3km', () => {
    it('should return an array of available drivers in 3km', () => {
      const result = controller.findAllAvailableIn3km('40.58', '80.5');
      expect(result).toEqual([drivers[1]]);
    });
  });

  describe('find3NearestDrivers', () => {
    it('should return an array of the 3 nearest drivers', () => {
      const result = controller.find3NearestDrivers('60.5', '68.4');
      expect(result).toEqual([drivers[0]]);
    });
  });

  describe('findOneById', () => {
    it('should return a driver by ID', () => {
      const result = controller.findOneById('1');
      expect(result).toEqual(drivers[0]);
    });

    it('should throw NotFoundException if driver not found', () => {
      expect(() => controller.findOneById('99')).toThrow(NotFoundException);
    });
  });
});