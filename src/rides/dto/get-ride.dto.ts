export class GetRideDto {
    constructor(id, passengerId, passengerName, driverId, driverName, startLatitude, startLongitude, endLatitude, endLongitude, status) {
        this.id = id;
        this.passengerId = passengerId;
        this.passengerName = passengerName;
        this.driverId = driverId;
        this.driverName = driverName;
        this.startLatitude = startLatitude;
        this.startLongitude = startLongitude;
        this.endLatitude = endLatitude;
        this.endLongitude = endLongitude;
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

