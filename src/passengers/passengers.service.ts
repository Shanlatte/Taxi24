import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from '../persons/entities/person.entity';
import { EntityManager, Repository } from 'typeorm';
import { GetPassengerDto } from './dto/get-passenger.dto';
import { Passenger } from './entities/passenger.entity';

@Injectable()
export class PassengersService {

  constructor(
    @InjectRepository(Passenger) private readonly passengerRepository: Repository<Passenger>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    private readonly entityManager: EntityManager,
  ) { }

  async create(createPassengerDto: CreatePassengerDto): Promise<GetPassengerDto> {
    const passengerFound = await this.personRepository.findOne({ where: { email: createPassengerDto.email } });

    //Check if there is another person with this email
    if (passengerFound) {
      throw new ConflictException('There is an existing person with this email');
    }

    let createdPassengerObject: GetPassengerDto;

    await this.entityManager.transaction(async (entityManager) => {
      const { name, email } = createPassengerDto;

      try {
        const person = this.personRepository.create({ name, email });
        await entityManager.save(person);

        const passenger = this.passengerRepository.create({ person });
        await entityManager.save(passenger);

        createdPassengerObject = new GetPassengerDto(passenger.id, person.name, person.email);
      } catch (error) {
        throw new InternalServerErrorException('Error creating passenger', error);
      }
    })

    return createdPassengerObject;
  }

  async findAll(): Promise<GetPassengerDto[]> {
    const passengers: Passenger[] = await this.passengerRepository.find({ relations: ['person'] });

    return passengers.map(passenger => new GetPassengerDto(passenger.id, passenger.person.name, passenger.person.email))
  }

  async findOneById(id: number): Promise<GetPassengerDto> {
    const passenger: Passenger = await this.passengerRepository.findOne({ where: { id }, relations: ['person'] });

    if (!passenger) {
      throw new NotFoundException('No passenger was found with this ID');
    }

    return new GetPassengerDto(passenger.id, passenger.person.name, passenger.person.email);
  }
}
