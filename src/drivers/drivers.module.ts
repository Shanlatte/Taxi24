import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver } from './entities/driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Location } from 'src/locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, Person, Location])],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule { }
