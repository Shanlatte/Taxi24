import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { Driver } from '../drivers/entities/driver.entity';
import { Location } from '../locations/entities/location.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Passenger } from '../passengers/entities/passenger.entity';
import { Ride } from './entities/ride.entity';
import { GetRideDto } from './dto/get-ride.dto';
import { Invoice } from '../invoices/entities/invoice.entity';

@Injectable()
export class RidesService {

  constructor(
    @InjectRepository(Ride) private readonly rideRepository: Repository<Ride>,
    @InjectRepository(Driver) private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Passenger) private readonly passengerRepository: Repository<Passenger>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    @InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>,
    private readonly entityManager: EntityManager,
  ) { }

  async create(createRideDto: CreateRideDto): Promise<Ride> {
    const driver = await this.driverRepository.findOneBy({ id: createRideDto.driverId });

    if (!driver) {
      throw new NotFoundException('No driver was found with this ID');
    }

    if (!driver.available) {
      throw new BadRequestException('The driver with this ID is not available');
    }

    const passenger = await this.passengerRepository.findOneBy({ id: createRideDto.passengerId });

    if (!passenger) {
      throw new NotFoundException('No passenger was found with this ID');
    }

    const activePassengerRide = await this.rideRepository.findOneBy({ passenger, status: 'active' })

    if (activePassengerRide) {
      throw new BadRequestException('The passenger with this ID is currently on a ride');
    }

    let ride = new Ride();
    await this.entityManager.transaction(async (entityManager) => {
      const { startLatitude, startLongitude, endLatitude, endLongitude } = createRideDto;

      try {
        //Update driver availability to false
        await this.driverRepository.update(driver.id, { available: false })

        const startLocation = this.locationRepository.create({ latitude: startLatitude, longitude: startLongitude });
        await entityManager.save(startLocation);

        const endLocation = this.locationRepository.create({ latitude: endLatitude, longitude: endLongitude });
        await entityManager.save(endLocation);

        ride = this.rideRepository.create({ driver, passenger, startLocation, endLocation, status: 'active' });
        await entityManager.save(ride);

      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    })

    return ride;
  }

  async findAll(): Promise<GetRideDto[]> {
    const rides: Ride[] = await this.rideRepository.find({ relations: ['passenger', 'driver', 'startLocation', 'endLocation'] });
    return rides.map(ride => new GetRideDto(ride.id, ride.passenger, ride.driver, ride.startLocation, ride.endLocation, ride.status));
  }

  async findAllActive(): Promise<GetRideDto[]> {
    const rides: Ride[] = await this.rideRepository.find({ where: { status: 'active' }, relations: ['passenger', 'driver', 'startLocation', 'endLocation'] });
    return rides.map(ride => new GetRideDto(ride.id, ride.passenger, ride.driver, ride.startLocation, ride.endLocation, ride.status));
  }

  async completeRide(id: number) {
    //Check if the ride exists
    const rideFound: Ride = await this.rideRepository.findOne({ where: { id }, relations: ['driver'] });

    if (!rideFound) {
      throw new NotFoundException('No ride was found with this ID');
    }

    if (rideFound.status !== 'active') {
      throw new BadRequestException(`Ride with ID ${id} is ${rideFound.status}, a ride with 'active' status is expected`);
    }

    await this.entityManager.transaction(async (entityManager) => {
      try {
        // Set driver available again
        await entityManager.update(Driver, { id: rideFound.driver.id }, { available: true });

        // Update ride status to 'finished'
        await entityManager.update(Ride, id, { status: 'finished' })

        // Create ride's invoice
        const date = new Date();
        const amount = parseFloat((Math.random() * (100)).toFixed(2)); // Generate random amount to have different data in the DB

        const invoice = this.invoiceRepository.create({ ride: rideFound, date, amount });
        await entityManager.save(invoice);

        return invoice;
      } catch (error) {
        throw new InternalServerErrorException("Error completing ride")
      }
    })
  }

  async findOneById(id: number): Promise<GetRideDto> {
    try {
      const ride: Ride = await this.rideRepository.findOne({ where: { id }, relations: ['passenger', 'driver', 'startLocation', 'endLocation'] });

      if (!ride) {
        throw new NotFoundException('No ride was found with this ID');
      }

      return new GetRideDto(ride.id, ride.passenger, ride.driver, ride.startLocation, ride.endLocation, ride.status);
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving ride');
    }
  }
}
