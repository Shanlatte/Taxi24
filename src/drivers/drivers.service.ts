import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { GetDriverDto } from './dto/get-driver.dto';
import { InjectRepository, } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { FindOptionsWhere, Repository, EntityManager } from 'typeorm';
import { Person } from 'src/persons/entities/person.entity';
import { Location } from 'src/locations/entities/location.entity';
import { calculateDistanceBetweenLocations } from 'src/locations/helpers/locationsDistanceHelper';

@Injectable()
export class DriversService {

  constructor(
    @InjectRepository(Driver) private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    private readonly entityManager: EntityManager,
  ) { }

  async create(createDriverDto: CreateDriverDto): Promise<GetDriverDto> {

    const driverFound = await this.personRepository.findOneBy(
      {
        email: createDriverDto.email,
      } as FindOptionsWhere<Person>,
    );

    if (driverFound) {
      throw new ConflictException('There is an existing person with this email');
    }

    let createdDriverObject: GetDriverDto;

    await this.entityManager.transaction(async (entityManager) => {
      const { name, email, latitude, longitude, available } = createDriverDto;

      try {
        const person: Person = this.personRepository.create({ name, email });
        await entityManager.save(person);

        const location: Location = this.locationRepository.create({ latitude, longitude });
        await entityManager.save(location);

        const driver: Driver = this.driverRepository.create({ person, location, available });
        await entityManager.save(driver);

        createdDriverObject = new GetDriverDto(driver.id, person, location, driver.available);

      } catch (error) {
        throw new InternalServerErrorException('Error creating driver', error);
      }
    })

    return createdDriverObject;
  }

  async findAll(): Promise<GetDriverDto[]> {
    const drivers: Driver[] = await this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.person', 'person')
      .leftJoinAndSelect('driver.location', 'location')
      .getMany();

    return drivers.map(driver => new GetDriverDto(driver.id, driver.person, driver.location, driver.available))
  }

  async findOne(id: number): Promise<GetDriverDto> {

    const driver: Driver = await this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.person', 'person')
      .leftJoinAndSelect('driver.location', 'location')
      .where('driver.id = :id', { id })
      .getOne();

    if (!driver) {
      throw new NotFoundException('No driver was found with this ID');
    }

    return new GetDriverDto(driver.id, driver.person, driver.location, driver.available);
  }

  async findAllAvailable(): Promise<GetDriverDto[]> {
    const drivers: Driver[] = await this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.person', 'person')
      .leftJoinAndSelect('driver.location', 'location')
      .where('driver.available = true')
      .getMany();

    return drivers.map(driver => new GetDriverDto(driver.id, driver.person, driver.location, driver.available))
  }

  async findAllAvailableIn3km(latitude: string, longitude: string): Promise<GetDriverDto[]> {
    const availableDrivers: GetDriverDto[] = await this.findAllAvailable();
    const nearAvailableDrivers: GetDriverDto[] = [];

    const parsedLatitude: number = parseFloat(latitude);
    const parsedLongitude: number = parseFloat(longitude);

    if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      throw new BadRequestException('Invalid latitude or longitude format');
    }

    availableDrivers.forEach((driver: GetDriverDto) => {
      const distance: number = calculateDistanceBetweenLocations(
        parsedLatitude,
        parsedLongitude,
        +driver.latitude,
        +driver.longitude,
      );

      if (distance <= 3.0 && distance >= 0) {
        nearAvailableDrivers.push(driver);
      }
    });

    if (!nearAvailableDrivers.length) {
      throw new NotFoundException('No drivers found');
    }

    return nearAvailableDrivers;
  }

  async find3NearestDrivers(latitude: string, longitude: string): Promise<GetDriverDto[]> {
    const availableDrivers: GetDriverDto[] = await this.findAllAvailable();

    if (!availableDrivers.length) {
      throw new NotFoundException('No drivers found');
    }

    const parsedLatitude: number = parseFloat(latitude);
    const parsedLongitude: number = parseFloat(longitude);

    if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      throw new BadRequestException('Invalid latitude or longitude format');
    }

    const distanceDriversMap: Map<number, GetDriverDto> = new Map();
    let sortedDrivers: GetDriverDto[] = [];

    availableDrivers.forEach(driver => {
      const distance: number = calculateDistanceBetweenLocations(
        parsedLatitude,
        parsedLongitude,
        +driver.latitude,
        +driver.longitude,
      );

      distanceDriversMap.set(distance, driver);
    })

    const sortedKeys = Array.from(distanceDriversMap.keys()).sort();
    for (const key of sortedKeys) {
      sortedDrivers.push(distanceDriversMap.get(key));
    }

    return sortedDrivers.slice(0, 3);
  }
}
