export class GetPassengerDto {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    id: number;

    name: string;

    email: string;
}
