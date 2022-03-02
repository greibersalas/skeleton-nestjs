import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { Prescription } from './prescription.entity';
import { PrescriptionService } from './prescription.service';

@Controller('prescription')
export class PrescriptionController {

    constructor(private readonly _prescriptionService: PrescriptionService){}

    @Get(':id')
    async getPrescription(@Param('id',ParseIntPipe) id: number): Promise<Prescription>{
        const prescription = await this._prescriptionService.get(id);
        return prescription;
    }

    @Get()
    async getPrescriptions(): Promise<Prescription[]>{
        const prescription = await this._prescriptionService.getAll();
        return prescription;
    }

    @Post()
    async createPrescription(@Body() prescription: Prescription): Promise<Prescription>{
        const create = await this._prescriptionService.create(prescription);
        return create;
    }

    @Put(':id')
    async updatePrescription(@Param('id',ParseIntPipe) id: number, @Body() prescription: Prescription){
        const update = await this._prescriptionService.update(id,prescription);
        return update;
    }

    @Delete(':id')
    async deletePrescription(@Param('id',ParseIntPipe) id: number){
        await this._prescriptionService.delete(id);
        return true;
    }

    @Get('get-patient-notes/:id')
    async getByPatient(@Param('id') id): Promise<Prescription[]>{
        return await this._prescriptionService.getByPatient(id);
    }

    @Get('get-by-medical-act/:id')
    async getByMedicalAct(@Param('id') id): Promise<Prescription[]>{
        return await this._prescriptionService.getByMedicalAct(id);
    }
}
