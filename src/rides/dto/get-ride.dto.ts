import { Driver } from "src/drivers/entities/driver.entity";
import { Location } from "src/locations/entities/location.entity";
import { Passenger } from "src/passengers/entities/passenger.entity";

export class GetRideDto {
    constructor(id: number, passenger: Passenger, driver: Driver, startLocation: Location, endLocation: Location, status: string) {
        this.id = id;
        this.passengerId = passenger.id;
        this.passengerName = passenger.person.name;
        this.driverId = driver.id;
        this.driverName = driver.person.name;
        this.startLatitude = startLocation.latitude;
        this.startLongitude = startLocation.longitude;
        this.endLatitude = endLocation.latitude;
        this.endLongitude = endLocation.longitude;
        this.status = status;
    }

    id: number;

    passengerId: number;

    passengerName: string;

    driverId: number;

    driverName: string;

    startLatitude: number;

    startLongitude: number;

    endLatitude: number;

    endLongitude: number;

    status: string;
}

