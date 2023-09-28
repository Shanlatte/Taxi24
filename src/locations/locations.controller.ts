import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor() {}
}
