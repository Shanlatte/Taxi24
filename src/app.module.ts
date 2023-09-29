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
      entities: [Person, Driver, Location],
      synchronize: true,
      logging: true,
    }),
    PersonsModule,
    DriversModule,
    LocationsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
