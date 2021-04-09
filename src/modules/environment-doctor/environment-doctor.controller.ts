import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { EnvironmentDoctor } from './environment-doctor.entity';
import { EnvironmentDoctorService } from './environment-doctor.service';
import { ReservationService } from '../reservation/reservation.service';

@Controller('environment-doctor')
export class EnvironmentDoctorController {
    constructor(private readonly _edService: EnvironmentDoctorService,
        private readonly _reservationService: ReservationService){}

    @Get(':id')
    async getEnvironmentDoctor(@Param('id',ParseIntPipe) id: number): Promise<EnvironmentDoctor>{
        const ed = await this._edService.get(id);
        return ed;
    }

    @Get()
    async getEnvironmentDoctors(): Promise<EnvironmentDoctor[]>{
        const ed = await this._edService.getAll();
        return ed;
    }

    @Post()
    async createEnvironmentDoctor(@Body() ed: EnvironmentDoctor): Promise<EnvironmentDoctor>{
        const create = await this._edService.create(ed);
        return create;
    }

    @Put(':id')
    async updateEnvironmentDoctor(@Param('id',ParseIntPipe) id: number, @Body() ed: EnvironmentDoctor){
        const update = await this._edService.update(id,ed);
        return update;
    }

    @Delete(':id')
    async deleteEnvironmentDoctor(@Param('id',ParseIntPipe) id: number){
        await this._edService.delete(id);
        return true;
    }

    @Get('programmin-day/:date/:campus/:doctor/:patient/:state')
    async getProgrammingDay(@Param('date') date: string, 
                            @Param('campus',ParseIntPipe) campus: number, 
                            @Param('doctor',ParseIntPipe) doctor: number,
                            @Param('patient',ParseIntPipe) patient: number,
                            @Param('state',ParseIntPipe) state: number
        ): Promise<any>{
        const reser = await this._reservationService.getByDay(date,campus);
        const programmming = await this._edService.programmingDay(date,reser,campus, doctor, patient,state);
        return programmming;
    }
}
