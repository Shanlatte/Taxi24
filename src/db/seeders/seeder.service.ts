import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from 'src/persons/entities/person.entity';
import { persons } from './data/persons';
import { locations } from './data/locations';
import { drivers } from './data/drivers';
import { passengers } from './data/passengers';
import { rides } from './data/rides';
import { invoices } from './data/invoices';
import { Driver } from 'src/drivers/entities/driver.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Ride } from 'src/rides/entities/ride.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    @InjectRepository(Driver) private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    @InjectRepository(Ride) private readonly rideRepository: Repository<Ride>,
    @InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Passenger) private readonly passengerRepository: Repository<Passenger>,
  ) { }

  async seedData() {
    await this.seedPersonsData();
    await this.seedLocationsData();
    await this.seedDriversData();
    await this.seedPassengersData();
    await this.seedRidesData();
    await this.seedInvoicesData();
  }

  async seedPersonsData() {
    for (const data of persons) {
      // Check if data with the same email exists
      const existingPerson = await this.personRepository.findOne({ where: { email: data.email } });

      if (!existingPerson) {
        // Person doesn't exist, so insert it
        const person = this.personRepository.create(data);
        await this.personRepository.save(person);
      } else {
        console.log('PERSON: There is existing data')
      }
    }
  }

  async seedLocationsData() {
    for (const data of locations) {
      // Check if data with the same latitude,longitude exists
      const existingLocation = await this.locationRepository.findOne({
        where: { latitude: data.latitude, longitude: data.longitude },
      });

      if (!existingLocation) {
        // Location doesn't exist, so insert it
        await this.locationRepository.save(data);
      } else {
        console.log('LOCATION: There is existing data')
      }
    }
  }

  async seedDriversData() {
    for (const data of drivers) {
      // Check if driver with the same person exists
      const person = await this.personRepository.findOneBy({ id: data.personId });
      const existingDriver = await this.driverRepository.findOneBy({ person });

      if (!existingDriver) {
        // Driver doesn't exist, so insert it
        const { available } = data
        const location = await this.locationRepository.findOneBy({ id: data.locationId });

        const driver: Driver = this.driverRepository.create({ person, location, available });
        await this.driverRepository.save(driver);
      } else {
        console.log('DRIVER: There is existing data')
      }
    }
  }

  async seedPassengersData() {
    for (const data of passengers) {
      // Check if passenger with the same person exists
      const person = await this.personRepository.findOneBy({ id: data.personId });
      const existinPassenger = await this.passengerRepository.findOneBy({ person });

      if (!existinPassenger) {
        const passenger = this.passengerRepository.create({ person });
        await this.passengerRepository.save(passenger);
      } else {
        console.log('PASSENGER: There is existing data')
      }
    }
  }

  async seedRidesData() {
    for (const data of rides) {
      const passenger = await this.passengerRepository.findOneBy({ id: data.passengerId });
      const driver = await this.driverRepository.findOneBy({ id: data.driverId });
      const startLocation = await this.locationRepository.findOneBy({ id: data.startLocationId });
      const endLocation = await this.locationRepository.findOneBy({ id: data.endLocationId });

      // Check if ride with the same passenger,driver,startLocation,endLocation exists
      const existingRide = await this.rideRepository.findOneBy({ passenger, driver, startLocation, endLocation });

      if (!existingRide) {
        // Data doesn't exist, so insert it
        const ride = this.rideRepository.create({ passenger, driver, startLocation, endLocation, status: data.status });
        await this.rideRepository.save(ride);
      } else {
        console.log('RIDE: There is existing data')
      }
    }
  }

  async seedInvoicesData() {
    for (const data of invoices) {

      // Check if invoice with the same ride exists
      const ride = await this.rideRepository.findOneBy({ id: data.rideId });

      const existingInvoice = await this.invoiceRepository.findOneBy({ ride });

      if (!existingInvoice) {
        const { amount, date } = data;
        // Data doesn't exist, so insert it
        const invoice = await this.invoiceRepository.create({ ride, amount, date });
        await this.invoiceRepository.save(invoice);
      } else {
        console.log('INVOICE: There is existing data')
      }
    }
  }
}