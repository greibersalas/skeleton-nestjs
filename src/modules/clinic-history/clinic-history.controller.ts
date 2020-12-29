import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ClinicHistory } from './clinic-history.entity';
import { ClinicHistoryService } from './clinic-history.service';

@Controller('clinic-history')
export class ClinicHistoryController {

    constructor(private readonly _clinicHistoryService: ClinicHistoryService){}

    @Get(':id')
    async getClinicHistory(@Param('id',ParseIntPipe) id: number): Promise<ClinicHistory>{
        const clinicHistory = await this._clinicHistoryService.get(id);
        return clinicHistory;
    }

    @Get('get-patient/:document')
    async getPatient(@Param('document') document): Promise<ClinicHistory>{
        const clinicHistory = await this._clinicHistoryService.getByDocumentNumber(document);
        return clinicHistory;
    }

    @Get()
    async getClinicHistorys(): Promise<ClinicHistory[]>{
        const clinicHistory = await this._clinicHistoryService.getAll();
        return clinicHistory;
    }

    @Post()
    async createClinicHistory(@Body() clinicHistory: ClinicHistory): Promise<ClinicHistory>{
        const create = await this._clinicHistoryService.create(clinicHistory);
        return create;
    }

    @Put(':id')
    async updateClinicHistory(@Param('id',ParseIntPipe) id: number, @Body() clinicHistory: ClinicHistory){
        const update = await this._clinicHistoryService.update(id,clinicHistory);
        return update;
    }

    @Delete(':id')
    async deleteClinicHistory(@Param('id',ParseIntPipe) id: number){
        await this._clinicHistoryService.delete(id);
        return true;
    }
}
