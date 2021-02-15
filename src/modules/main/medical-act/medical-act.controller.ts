import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { MedicalAct } from './medical-act.entity';
import { MedicalActService } from './medical-act.service';

@Controller('medical-act')
export class MedicalActController {

    constructor(private readonly _medicalActService: MedicalActService){}

    @Get(':id')
    async getMedicalAct(@Param('id',ParseIntPipe) id: number): Promise<MedicalAct>{
        const medicalAct = await this._medicalActService.get(id);
        return medicalAct;
    }

    @Get()
    async getMedicalActs(): Promise<MedicalAct[]>{
        const medicalAct = await this._medicalActService.getAll();
        return medicalAct;
    }

    @Post()
    async createMedicalAct(@Body() medicalAct: MedicalAct): Promise<MedicalAct>{
        const create = await this._medicalActService.create(medicalAct);
        return create;
    }

    @Put(':id')
    async updateMedicalAct(@Param('id',ParseIntPipe) id: number, @Body() medicalAct: MedicalAct){
        const update = await this._medicalActService.update(id,medicalAct);
        return update;
    }

    @Delete(':id')
    async deleteMedicalAct(@Param('id',ParseIntPipe) id: number){
        await this._medicalActService.delete(id);
        return true;
    }

    @Get('get-by-reservation/:id')
    async getFirst(@Param('id') id): Promise<MedicalAct>{
        return await this._medicalActService.getByReservation(id);
    }
}
