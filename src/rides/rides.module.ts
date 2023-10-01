import { Module } from '@nestjs/common';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Ride } from './entities/ride.entity';
import { Driver } from 'src/drivers/entities/driver.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ride, Passenger, Driver, Location, Invoice])],
  controllers: [RidesController],
  providers: [RidesService],
})
export class RidesModule { }
