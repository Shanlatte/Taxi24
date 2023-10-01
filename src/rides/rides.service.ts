import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { Driver } from 'src/drivers/entities/driver.entity';
import { Location } from 'src/locations/entities/location.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Ride } from './entities/ride.entity';
import { GetRideDto } from './dto/get-ride.dto';
import { Invoice } from 'src/invoices/entities/invoice.entity';

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

  async create(createRideDto: CreateRideDto): Promise<GetRideDto> {

    const driver = await this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.person', 'person')
      .where('driver.id = :id', { id: createRideDto.driverId })
      .getOne();

    if (!driver) {
      throw new NotFoundException('No driver was found with this ID');
    }

    if (!driver.available) {
      throw new BadRequestException('The driver with this ID is not available');
    }

    const passenger = await this.passengerRepository
      .createQueryBuilder('passenger')
      .leftJoinAndSelect('passenger.person', 'person')
      .where('passenger.id = :id', { id: createRideDto.passengerId })
      .getOne();

    if (!passenger) {
      throw new NotFoundException('No passenger was found with this ID');
    }

    const activePassengerRide = await this.rideRepository.findOneBy({ passenger, status: 'active' })

    if (activePassengerRide) {
      throw new BadRequestException('The passenger with this ID is currently on a ride');
    }

    let createdRideObject: GetRideDto;

    await this.entityManager.transaction(async (entityManager) => {
      const { startLatitude, startLongitude, endLatitude, endLongitude } = createRideDto;

      try {
        //Update driver availability to false
        await this.driverRepository.update(driver.id, { available: false })

        const startLocation = this.locationRepository.create({ latitude: startLatitude, longitude: startLongitude });
        await entityManager.save(startLocation);

        const endLocation = this.locationRepository.create({ latitude: endLatitude, longitude: endLongitude });
        await entityManager.save(endLocation);

        const ride = this.rideRepository.create({ driver, passenger, startLocation, endLocation, status: 'active' });
        await entityManager.save(ride);

        createdRideObject = new GetRideDto(ride.id, passenger, driver, startLocation, endLocation, ride.status)
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    })

    return createdRideObject;
  }

  async findAll(): Promise<GetRideDto[]> {
    const rides: Ride[] = await this.rideRepository
      .createQueryBuilder('ride')
      .leftJoinAndSelect('ride.passenger', 'passenger')
      .leftJoinAndSelect('passenger.person', 'personP')
      .leftJoinAndSelect('ride.driver', 'driver')
      .leftJoinAndSelect('driver.person', 'personD')
      .leftJoinAndSelect('ride.startLocation', 'startLocation')
      .leftJoinAndSelect('ride.endLocation', 'endLocation')
      .getMany();

    return rides.map(ride => new GetRideDto(ride.id, ride.passenger, ride.driver, ride.startLocation, ride.endLocation, ride.status));
  }

  async findAllActive(): Promise<GetRideDto[]> {
    const rides: Ride[] = await this.rideRepository
      .createQueryBuilder('ride')
      .leftJoinAndSelect('ride.passenger', 'passenger')
      .leftJoinAndSelect('passenger.person', 'personP')
      .leftJoinAndSelect('ride.driver', 'driver')
      .leftJoinAndSelect('driver.person', 'personD')
      .leftJoinAndSelect('ride.startLocation', 'startLocation')
      .leftJoinAndSelect('ride.endLocation', 'endLocation')
      .where("ride.status = 'active'")
      .getMany();

    return rides.map(ride => new GetRideDto(ride.id, ride.passenger, ride.driver, ride.startLocation, ride.endLocation, ride.status));
  }

  async completeRide(id: number) {
    //Check if the ride exists
    const rideFound: Ride = await this.rideRepository
      .createQueryBuilder('ride')
      .leftJoinAndSelect('ride.driver', 'driver')
      .leftJoinAndSelect('ride.passenger', 'passenger')
      .where('ride.id = :id', { id })
      .getOne();

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

  async findOneById(id: number) {
    try {
      const ride: Ride = await this.rideRepository
        .createQueryBuilder('ride')
        .leftJoinAndSelect('ride.passenger', 'passenger')
        .leftJoinAndSelect('passenger.person', 'personP')
        .leftJoinAndSelect('ride.driver', 'driver')
        .leftJoinAndSelect('driver.person', 'personD')
        .leftJoinAndSelect('ride.startLocation', 'startLocation')
        .leftJoinAndSelect('ride.endLocation', 'endLocation')
        .where('ride.id = :id', { id })
        .getOne();

      if (!ride) {
        throw new NotFoundException('No passenger was found with this ID');
      }

      return new GetRideDto(ride.id, ride.passenger, ride.driver, ride.startLocation, ride.endLocation, ride.status);
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving ride')
    }
  }
}
