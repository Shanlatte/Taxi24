import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Min,
    Max
} from 'class-validator';

export class CreateDriverDto {
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Min(-90)
    @Max(90)
    @IsNotEmpty()
    latitude: number;

    @Min(-180)
    @Max(180)
    @IsNotEmpty()
    longitude: number;

    @IsNotEmpty()
    available: boolean;
}
