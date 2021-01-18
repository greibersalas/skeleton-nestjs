import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class QuotationDto{

    @IsNumber()
    id: number;
    
    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    idclinichistory: number;

    @IsNotEmpty()
    @IsNumber()
    idcoin: number;

    @IsNotEmpty()
    @IsNumber()
    idbusinessline: number;

    @IsNotEmpty()
    @IsNumber()
    specialty: number;

    @IsNotEmpty()
    @IsNumber()
    iddoctor: number;

    @IsNotEmpty()
    @IsNumber()
    subtotal: number;

    @IsNotEmpty()
    @IsNumber()
    tax: number;

    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @IsNotEmpty()
    @IsNumber()
    total: number;

    @IsNumber()
    state: number;

    createdAt: Date;
    updatedAt: Date;
    
}