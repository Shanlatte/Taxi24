import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    ) { }

    async findAll(): Promise<Location[]> {
        return await this.locationRepository.find();
    }
}
