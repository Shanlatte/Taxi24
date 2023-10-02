import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

const locations: Location[] = [{ id: 1, latitude: -31.2, longitude: -48.5 }, { id: 2, latitude: -41.2, longitude: -58.5 }, { id: 3, latitude: -91.2, longitude: -30.5 }];

class LocationRepositoryMock {
  find() {
    return Promise.resolve(locations);
  }
}

describe('LocationsService', () => {
  let service: LocationsService;
  let repository: Repository<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(Location),
          useClass: LocationRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    repository = module.get<Repository<Location>>(getRepositoryToken(Location));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const locations = await service.findAll();
      expect(locations).toEqual(locations);
    });

    it('should call find method of LocationRepository', async () => {
      const findSpy = jest.spyOn(repository, 'find');
      await service.findAll();
      expect(findSpy).toHaveBeenCalled();
    });
  });
});