import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { EnvironmentDoctor } from './environment-doctor.entity';
import { EnvironmentDoctorService } from './environment-doctor.service';

@Controller('environment-doctor')
export class EnvironmentDoctorController {
    constructor(private readonly _edService: EnvironmentDoctorService){}

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

    @Get('programmin-day/:date')
    async getProgrammingDay(@Param('date') date: string): Promise<any>{
        const programmming = await this._edService.programmingDay(date);
        return programmming;
    }
}
