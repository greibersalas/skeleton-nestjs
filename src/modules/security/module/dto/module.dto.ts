import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ModuleDto{
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsBoolean()
    breadcrumbs: boolean;

    @IsNotEmpty()
    @IsString()
    group: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    state: number;
}