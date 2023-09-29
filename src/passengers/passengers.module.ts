import { Module } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { PassengersController } from './passengers.controller';
import { Passenger } from './entities/passenger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/persons/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger, Person])],
  controllers: [PassengersController],
  providers: [PassengersService],
})
export class PassengersModule {}
