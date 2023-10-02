import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) { }

  @Post()
  create(@Body() createRideDto: CreateRideDto) {
    return this.ridesService.create(createRideDto);
  }

  @Get()
  findAll() {
    return this.ridesService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.ridesService.findAllActive();
  }

  @Patch('complete/:id')
  completeRide(@Param('id') id: string) {
    return this.ridesService.completeRide(+id);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.ridesService.findOneById(+id);
  }
}
