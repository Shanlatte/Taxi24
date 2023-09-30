import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) { }

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  findAll() {
    return this.driversService.findAll();
  }

  @Get('available')
  findAllAvailable() {
    return this.driversService.findAllAvailable();
  }

  @Get('available3km/:latitude/:longitude')
  findAllAvailableIn3km(@Param('latitude') latitude: string, @Param('longitude') longitude: string) {
    return this.driversService.findAllAvailableIn3km(latitude, longitude);
  }

  @Get('find3NearestDrivers/:latitude/:longitude')
  find3NearestDrivers(@Param('latitude') latitude: string, @Param('longitude') longitude: string) {
    return this.driversService.find3NearestDrivers(latitude, longitude);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(+id);
  }
}
