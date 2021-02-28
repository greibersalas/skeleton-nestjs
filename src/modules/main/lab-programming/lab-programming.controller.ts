import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { LabProgramming } from './lab-programming.entity';
import { LabProgrammingService } from './lab-programming.service';

@Controller('lab-programming')
export class LabProgrammingController {

    constructor(private readonly _labProgrammingService: LabProgrammingService){}

    @Get(':id')
    async getLabProgramming(@Param('id',ParseIntPipe) id: number): Promise<LabProgramming>{
        const labProgramming = await this._labProgrammingService.get(id);
        return labProgramming;
    }

    @Get()
    async getLabProgrammings(): Promise<LabProgramming[]>{
        const labProgramming = await this._labProgrammingService.getAll();
        return labProgramming;
    }

    @Post()
    async createLabProgramming(@Body() labProgramming: LabProgramming): Promise<LabProgramming>{
        const create = await this._labProgrammingService.create(labProgramming);
        return create;
    }

    @Put(':id')
    async updateLabProgramming(@Param('id',ParseIntPipe) id: number, @Body() labProgramming: LabProgramming){
        const update = await this._labProgrammingService.update(id,labProgramming);
        return update;
    }

    @Delete(':id')
    async deleteLabProgramming(@Param('id',ParseIntPipe) id: number){
        await this._labProgrammingService.delete(id);
        return true;
    }

    @Get('validate-date/:date/:job')
    async validateDate(@Param('date') date: Date, @Param('job') job: string): Promise<boolean>{
        const exists = await this._labProgrammingService.validateDate(date,job);
        return exists;
    }

    @Get('get-by-job/:date/:job')
    async getByJob(@Param('date') date: Date, @Param('job') job: string): Promise<LabProgramming>{
        const prog = await this._labProgrammingService.getByJob(date,job);
        return prog;
    }
}
