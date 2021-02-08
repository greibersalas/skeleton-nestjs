import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ClinicHistoryNotes } from './clinic-history-notes.entity';
import { ClinicHistoryNotesService } from './clinic-history-notes.service';

@Controller('clinic-history-notes')
export class ClinicHistoryNotesController {
    constructor(private readonly _chnService: ClinicHistoryNotesService){}

    @Get(':id')
    async getClinicHistoryNotes(@Param('id',ParseIntPipe) id: number): Promise<ClinicHistoryNotes>{
        const clinicHistoryNotes = await this._chnService.get(id);
        return clinicHistoryNotes;
    }

    @Get()
    async getClinicHistoryNotess(): Promise<ClinicHistoryNotes[]>{
        const clinicHistoryNotes = await this._chnService.getAll();
        return clinicHistoryNotes;
    }

    @Post()
    async createClinicHistoryNotes(@Body() clinicHistoryNotes: ClinicHistoryNotes): Promise<ClinicHistoryNotes>{
        const create = await this._chnService.create(clinicHistoryNotes);
        return create;
    }

    @Put(':id')
    async updateClinicHistoryNotes(@Param('id',ParseIntPipe) id: number, @Body() clinicHistoryNotes: ClinicHistoryNotes){
        const update = await this._chnService.update(id,clinicHistoryNotes);
        return update;
    }

    @Delete(':id')
    async deleteClinicHistoryNotes(@Param('id',ParseIntPipe) id: number){
        await this._chnService.delete(id);
        return true;
    }

    @Get('get-patient/:id')
    async getByPatient(@Param('id') id): Promise<ClinicHistoryNotes[]>{
        return await this._chnService.getByPatient(id);
    }
}
