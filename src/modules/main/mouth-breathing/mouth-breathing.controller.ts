import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../../security/audit/audit.entity';
import { MouthBreathing } from './mouth-breathing.entity';
import { MouthBreathingService } from './mouth-breathing.service';

@UseGuards(JwtAuthGuard)
@Controller('mouth-breathing')
export class MouthBreathingController {

    constructor(private readonly _mouthBreathingService: MouthBreathingService){}

    @Get(':id')
    async getMouthBreathing(@Param('id',ParseIntPipe) id: number): Promise<MouthBreathing>{
        const mouthBreathing = await this._mouthBreathingService.get(id);
        return mouthBreathing;
    }

    @Get()
    async getMouthBreathings(): Promise<MouthBreathing[]>{
        const mouthBreathing = await this._mouthBreathingService.getAll();
        return mouthBreathing;
    }

    @Post()
    async createMouthBreathing(
        @Body() mouthBreathing: MouthBreathing,
        @Request() req: any
    ): Promise<MouthBreathing>{
        const create = await this._mouthBreathingService.create(mouthBreathing);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'mouth-breathing';
        audit.description = 'Insertar registro';
        audit.data = JSON.stringify(create);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return create;
    }

    @Put(':id')
    async updateMouthBreathing(
        @Param('id',ParseIntPipe) id: number,
        @Body() mouthBreathing: MouthBreathing,
        @Request() req: any
    ){
        const update = await this._mouthBreathingService.update(id,mouthBreathing);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'mouth-breathing';
        audit.description = 'Update registro';
        audit.data = JSON.stringify(update);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    @Delete(':id')
    async deleteMouthBreathing(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._mouthBreathingService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'mouth-breathing';
        audit.description = 'Delete registro';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return true;
    }

    @Get('clinic-history/:id')
    async getClinicHistory(@Param('id',ParseIntPipe) id: number): Promise<MouthBreathing>{
        const mouthBreathing = await this._mouthBreathingService.getByClinicHistory(id);
        return mouthBreathing;
    }
}
