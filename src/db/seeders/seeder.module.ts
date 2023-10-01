import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { Person } from 'src/persons/entities/person.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from 'src/drivers/entities/driver.entity';
import { Ride } from 'src/rides/entities/ride.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Location } from 'src/locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Driver, Location, Ride, Invoice, Passenger])],
  providers: [SeederService],
})
export class SeederModule { }