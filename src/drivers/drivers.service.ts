import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { GetDriverDto } from './dto/get-driver.dto';
import { InjectRepository, } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { Repository, EntityManager } from 'typeorm';
import { Person } from '../persons/entities/person.entity';
import { Location } from '../locations/entities/location.entity';
import { calculateDistanceBetweenLocations, parseLocation } from '../utils/locationsUtil';

@Injectable()
export class DriversService {

  constructor(
    @InjectRepository(Driver) private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    private readonly entityManager: EntityManager,
  ) { }

  async create(createDriverDto: CreateDriverDto): Promise<GetDriverDto> {

    const driverFound = await this.personRepository.findOne({ where: { email: createDriverDto.email } });

    //Check if there is another person with this email
    if (driverFound) {
      throw new ConflictException('There is an existing person with this email');
    }

    let createdDriverObject: GetDriverDto;

    await this.entityManager.transaction(async (entityManager) => {
      const { name, email, latitude, longitude, available } = createDriverDto;

      try {
        // Create person record
        const person: Person = this.personRepository.create({ name, email });
        await entityManager.save(person);

        // Create location record
        const location: Location = this.locationRepository.create({ latitude, longitude });
        await entityManager.save(location);

        // Create driver record
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
    const drivers: Driver[] = await this.driverRepository.find({ relations: ['person', 'location'] });
    return drivers.map(driver => new GetDriverDto(driver.id, driver.person, driver.location, driver.available))
  }

  async findOneById(id: number): Promise<GetDriverDto> {
    //Check if the id is not a number
    if (isNaN(id)) {
      throw new BadRequestException('Invalid id format');
    }

    const driver: Driver = await this.driverRepository.findOne({ where: { id }, relations: ['person', 'location'] });

    //Check if there is driver with this id
    if (!driver) {
      throw new NotFoundException('No driver was found with this ID');
    }

    return new GetDriverDto(driver.id, driver.person, driver.location, driver.available);
  }

  async findAllAvailable(): Promise<GetDriverDto[]> {
    const drivers: Driver[] = await this.driverRepository.find({ where: { available: true }, relations: ['person', 'location'] });

    return drivers.map(driver => new GetDriverDto(driver.id, driver.person, driver.location, driver.available))
  }

  async findAllAvailableIn3km(latitude: string, longitude: string): Promise<GetDriverDto[]> {
    const availableDrivers: GetDriverDto[] = await this.findAllAvailable();
    const nearAvailableDrivers: GetDriverDto[] = [];

    const { parsedLatitude, parsedLongitude } = parseLocation(latitude, longitude);

    availableDrivers.forEach((driver: GetDriverDto) => {
      // Get distance in km between the provided location and the driver location
      const distance: number = calculateDistanceBetweenLocations(parsedLatitude, parsedLongitude, +driver.latitude, +driver.longitude,);

      // If the distance is between 0 and 3km, add that driver to the result list
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

    // Check if there is available drivers
    if (!availableDrivers.length) {
      throw new NotFoundException('No available drivers found');
    }

    const { parsedLatitude, parsedLongitude } = parseLocation(latitude, longitude);

    const distanceDriversMap: Map<number, GetDriverDto> = new Map();
    let sortedDrivers: GetDriverDto[] = [];

    availableDrivers.forEach(driver => {
      // Get distance in km between the provided location and the driver location
      const distance: number = calculateDistanceBetweenLocations(parsedLatitude, parsedLongitude, +driver.latitude, +driver.longitude,);

      distanceDriversMap.set(distance, driver);
    })

    // Sort drivers by distance and add just 3 to the result list
    const sortedKeys = Array.from(distanceDriversMap.keys()).sort();
    for (const key of sortedKeys) {
      sortedDrivers.push(distanceDriversMap.get(key));
    }

    return sortedDrivers.slice(0, 3);
  }
}
