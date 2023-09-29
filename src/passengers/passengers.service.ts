import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/persons/entities/person.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { GetPassengerDto } from './dto/get-passenger.dto';
import { Passenger } from './entities/passenger.entity';

@Injectable()
export class PassengersService {

  constructor(
    @InjectRepository(Passenger) private readonly passengerRepository: Repository<Passenger>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    private readonly entityManager: EntityManager,
  ) { }

  async create(createPassengerDto: CreatePassengerDto) :Promise<GetPassengerDto> {
    const passengerFound = await this.personRepository.findOneBy(
      {
        email: createPassengerDto.email,
      } as FindOptionsWhere<Person>,
    );

    if (passengerFound) {
      throw new ConflictException('There is an existing person with this email');
    }

    let createdPassengerObject: GetPassengerDto;

    await this.entityManager.transaction(async (entityManager) => {
      const { name, email} = createPassengerDto;

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

  findAll() {
    return `This action returns all passengers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} passenger`;
  }

  remove(id: number) {
    return `This action removes a #${id} passenger`;
  }
}
