import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PersonsModule } from './persons/persons.module';
import { Person } from './persons/entities/person.entity';
import { DriversModule } from './drivers/drivers.module';
import { LocationsModule } from './locations/locations.module';
import { Driver } from './drivers/entities/driver.entity';
import { Location } from './locations/entities/location.entity';
import { PassengersModule } from './passengers/passengers.module';
import { Passenger } from './passengers/entities/passenger.entity';
import { RidesModule } from './rides/rides.module';
import { Ride } from './rides/entities/ride.entity';
import { InvoicesModule } from './invoices/invoices.module';
import { Invoice } from './invoices/entities/invoice.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.PORT),
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_NAME,
      entities: [Person, Driver, Location, Passenger, Ride, Invoice],
      synchronize: true,
      logging: true,
    }),
    PersonsModule,
    DriversModule,
    LocationsModule,
    PassengersModule,
    RidesModule,
    InvoicesModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
