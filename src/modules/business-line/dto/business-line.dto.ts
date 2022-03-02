import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BusinessLineDto{

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;
}