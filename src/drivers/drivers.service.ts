import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { GetDriverDto } from './dto/get-driver.dto';
import { InjectRepository, } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { FindOptionsWhere, Repository, EntityManager } from 'typeorm';
import { Person } from 'src/persons/entities/person.entity';
import { Location } from 'src/locations/entities/location.entity';

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
        const person = this.personRepository.create({ name, email });
        await entityManager.save(person);

        const location = this.locationRepository.create({ latitude, longitude });
        await entityManager.save(location);

        const driver = this.driverRepository.create({ person, location, available });
        await entityManager.save(driver);

        createdDriverObject = new GetDriverDto(driver.id, person, location, driver.available);

      } catch (error) {
        throw new InternalServerErrorException('Error creating driver', error);
      }
    })

    return createdDriverObject;
  }

  async findAll(): Promise<GetDriverDto[]> {
    const drivers = await this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.person', 'person')
      .leftJoinAndSelect('driver.location', 'location')
      .getMany();

    return drivers.map(driver => new GetDriverDto(driver.id, driver.person, driver.location, driver.available))
  }

  async findOne(id: number): Promise<GetDriverDto> {

    const driver = await this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.person', 'person')
      .leftJoinAndSelect('driver.location', 'location')
      .where('driver.id = :id', { id })
      .getOne();

    if (!driver) {
      throw new NotFoundException('No driver was found with this id');
    }

    return new GetDriverDto(driver.id, driver.person, driver.location, driver.available);
  }
}
