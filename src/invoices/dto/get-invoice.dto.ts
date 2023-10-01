export class GetInvoiceDto {
    constructor(id, passengerId, passengerName, driverId, driverName, amount) {
        this.id = id;
        this.passengerId = passengerId;
        this.passengerName = passengerName;
        this.driverId = driverId;
        this.driverName = driverName;
        this.amount = amount;
    }

    id: number;

    passengerId: number;

    passengerName: string;

    driverId: number;

    driverName: string;

    amount: number;
}

