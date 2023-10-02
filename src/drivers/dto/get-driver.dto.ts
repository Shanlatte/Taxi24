import { Location } from "src/locations/entities/location.entity";
import { Person } from "src/persons/entities/person.entity";

export class GetDriverDto {

    constructor(id, person: Person, location: Location, available: boolean) {
        this.id = id;
        this.name = person.name;
        this.email = person.email;
        this.latitude = location.latitude;
        this.longitude = location.longitude;
        this.available = available;
    }

    id: number;

    name: string;

    email: string;

    latitude: number;

    longitude: number;

    available: boolean;
}
