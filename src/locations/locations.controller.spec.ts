import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';

const locations: Location[] = [{ id: 1, latitude: -31.2, longitude: -48.5 }, { id: 2, latitude: -41.2, longitude: -58.5 }, { id: 3, latitude: -91.2, longitude: -30.5 }];

// Mock de LocationsService
class LocationsServiceMock {
  findAll() {
    return locations;
  }
}

describe('LocationsController', () => {
  let controller: LocationsController;
  let service: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        {
          provide: LocationsService,
          useClass: LocationsServiceMock, //LocationsService Mock
        },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of locations', () => {
      const result = controller.findAll();
      expect(result).toEqual(locations);
    });

    it('should call findAll method of LocationsService', () => {
      const findAllSpy = jest.spyOn(service, 'findAll');
      controller.findAll();
      expect(findAllSpy).toHaveBeenCalled();
    });
  });
});
