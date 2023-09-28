export class GetDriverDto {

    constructor(id, name, email, latitude, longitude, available) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.latitude = latitude;
        this.longitude = longitude;
        this.available = available;
    }
    
    id: number;

    name: string;

    email: string;

    latitude: number;

    longitude: number;

    available: boolean;
}
