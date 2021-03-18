import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';

@Controller('doctor')
export class DoctorController {

    constructor(private readonly _doctorService: DoctorService){}

    @Get(':id')
    async getDoctor(@Param('id',ParseIntPipe) id: number): Promise<Doctor>{
        const doctor = await this._doctorService.get(id);
        return doctor;
    }

    @Get()
    async getDoctors(): Promise<Doctor[]>{
        const doctors = await this._doctorService.getAll();
        return doctors;
    }

    @Post()
    async createDoctor(@Body() doctor: Doctor): Promise<Doctor>{
        const create = await this._doctorService.create(doctor);
        return create;
    }

    @Put(':id')
    async updateDoctor(@Param('id',ParseIntPipe) id: number, @Body() doctor: Doctor){
        const update = await this._doctorService.update(id,doctor);
        return update;
    }

    @Delete(':id')
    async deleteDoctor(@Param('id',ParseIntPipe) id: number){
        await this._doctorService.delete(id);
        return true;
    }

    @Get('get-in-bl/:id/:day')
    async getInBl(@Param('id',ParseIntPipe) id: number, @Param('day',ParseIntPipe) day: number): Promise<Doctor[]>{
        return await this._doctorService.getInBl(id,day);
    }
}
