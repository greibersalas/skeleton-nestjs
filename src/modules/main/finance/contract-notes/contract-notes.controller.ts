import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');
import { Audit } from 'src/modules/security/audit/audit.entity';

import { ContractNotesService } from './contract-notes.service';
import { ContractNotesDto } from './dto/contract-notes-dto';
import { ContractNotes } from './entity/contract-notes.entity';

@UseGuards(JwtAuthGuard)
@Controller('contract-notes')
export class ContractNotesController {

    private module = 'contract-notes';
    constructor(
        private service: ContractNotesService
    ) { }

    @Get(':id')
    async getContractNotes(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ContractNotesDto> {
        return await this.service.getOne(id);
    }

    @Get('/contract/:id')
    async getContractNotesByContract(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ContractNotesDto[]> {
        return await this.service.getByContract(id);
    }

    @Get()
    async getContractNotess(): Promise<ContractNotesDto[]> {
        return await this.service.get();
    }

    @Post()
    async create(
        @Body() data: ContractNotesDto,
        @Request() req: any
    ): Promise<ContractNotes> {
        const note: ContractNotes = new ContractNotes();
        note.title = data.title;
        note.note = data.note;
        note.contract = data.idcontract;
        note.user = req.user.id;
        const create = await this.service.create(note);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = this.module;
        audit.description = 'Insert registro';
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
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ContractNotesDto
    ) {
        return await this.service.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
