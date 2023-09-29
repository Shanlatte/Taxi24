import {
    IsNotEmpty,
    Min,
    Max,
    IsNumber
} from 'class-validator';

export class CreateRideDto {
    @IsNotEmpty()
    @IsNumber()
    passengerId: number;

    @IsNotEmpty()
    @IsNumber()
    driverId: number;

    @Min(-90)
    @Max(90)
    @IsNotEmpty()
    startLatitude: number;

    @Min(-180)
    @Max(180)
    @IsNotEmpty()
    startLongitude: number;

    @Min(-90)
    @Max(90)
    @IsNotEmpty()
    endLatitude: number;

    @Min(-180)
    @Max(180)
    @IsNotEmpty()
    endLongitude: number;
}

