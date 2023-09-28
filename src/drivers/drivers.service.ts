import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Location } from 'src/locations/entities/location.entity';

@Injectable()
export class DriversService {

  constructor(
    @InjectRepository(Driver) private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
  ) { }


  async create(createDriverDto: CreateDriverDto) {
    const { name, email, latitude, longitude, available } = createDriverDto;
    const driverFound = await this.personRepository.findOneBy(
      {
        email: createDriverDto.email,
      } as FindOptionsWhere<Person>,
    );

    if (driverFound) {
      throw new ConflictException('There is an existing driver with this email');
    }

    try {
      const person = this.personRepository.create({ name, email });
      await this.personRepository.save(person)

      const location = this.locationRepository.create({ latitude, longitude });
      await this.locationRepository.save(location)

      const driver = this.driverRepository.create({ person, location, available });
      return this.driverRepository.save(driver);

    } catch (error) {
      throw new InternalServerErrorException('Error creating driver', error);
    }
  }

  findAll() {
    return `This action returns all drivers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} driver`;
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
