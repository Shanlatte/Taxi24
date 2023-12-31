import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
  } from 'class-validator';

export class CreatePersonDto {
    @IsString()
    @MinLength(2, { message: 'Name must have at least 2 characters.' })
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

