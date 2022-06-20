import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
import { LabState } from './lab-state.entity';
import { LabStateService } from './lab-state.service';
var moment = require('moment-timezone');

@UseGuards(JwtAuthGuard)
@Controller('lab-state')
export class LabStateController {

    constructor(private readonly labStateService: LabStateService){}

    @Get(':id')
    async getlabState(@Param('id', ParseIntPipe) id: number): Promise<LabState>{
        const labState = await this.labStateService.get(id);
        return labState;
    }

    @Get()
    async getlabStates(): Promise<LabState[]>{
        const labState = await this.labStateService.getAll();
        return labState;
    }

    @Post()
    async createlabState(@Body() labState: LabState, @Request() req: any): Promise<LabState>{
        labState.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        labState.iduser = Number(req.user.id);
        const create = await this.labStateService.create(labState);
        return create;
    }

    @Put(':id')
    async updatelabState(
        @Param('id',ParseIntPipe) id: number,
        @Body() labState: LabState,
        @Request() req: any
    ){
        labState.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        labState.iduser = Number(req.user.id);
        const update = await this.labStateService.update(id,labState);
        return update;
    }

    @Delete(':id')
    async deletelabState(@Param('id',ParseIntPipe) id: number){
        await this.labStateService.delete(id);
        return true;
    }
}
