import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignupDto{
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsArray()
    campus: number[];

    @IsNotEmpty()
    roles: any;
}