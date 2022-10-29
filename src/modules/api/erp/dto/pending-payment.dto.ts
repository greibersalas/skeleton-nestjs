import { IsNumber, IsString } from 'class-validator';

export class PendingPaymentDto{
    // ID medical_Act_attention
    @IsNumber()
    id: number;

    // Nro. documento paciente
    @IsString()
    dni: string;

    // Nro. cliente tabla clinic_history
    @IsString()
    id_pagador: string;

    // ID producto ERP tabla tariff
    @IsString()
    id_producto: string;

    // Descripción del tratamiento
    @IsString()
    detalle: string;

    // Cantidad de tratamientos
    @IsNumber()
    cantidad: number;

    // Precio unitario
    @IsNumber()
    precio: number;

    // Moneda
    @IsString()
    fecha: string;

    // Moneda
    @IsString()
    moneda: string;
}