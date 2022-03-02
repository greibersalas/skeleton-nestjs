import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MouthBreathingDto{
    @IsNotEmpty()
    @IsString()
    clinichistory: string;

    @IsNotEmpty()
    @IsString()
    date: string;

    @IsNotEmpty()
    @IsNumber()
    state: number;
}