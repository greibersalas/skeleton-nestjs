import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../security/audit/audit.entity';
import { AttentionCard } from './attention-card.entity';
import { AttentionCardService } from './attention-card.service';
//FPDF
const FPDF = require('node-fpdf');

//PDF's
import { PdfAttentionCard } from './pdf/pdf-attention-card';

@UseGuards(JwtAuthGuard)
@Controller('attentioncard')
export class AttentionCardController {
    constructor(private readonly _attentionCardService: AttentionCardService) { }

    @Get('history/:id')
    async getByClinicHistory(@Param('id', ParseIntPipe) id: number): Promise<AttentionCard> {
        const attentionCard = await this._attentionCardService.getByClinicHistory(id);
        return attentionCard;
    }

    @Get(':id')
    async getAttentionCard(@Param('id', ParseIntPipe) id: number): Promise<AttentionCard> {
        const attentionCard = await this._attentionCardService.get(id);
        return attentionCard;
    }

    @Get()
    async getAttentionCards(): Promise<AttentionCard[]> {
        const attentionCard = await this._attentionCardService.getAll();
        return attentionCard;
    }

    @Post()
    async createAttentionCard(
        @Body() attentionCard: AttentionCard,
        @Request() req: any
    ): Promise<AttentionCard> {
        const create = await this._attentionCardService.create(attentionCard);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'attention-card';
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
    async updateAttentionCard(
        @Param('id', ParseIntPipe) id: number,
        @Body() attentionCard: AttentionCard,
        @Request() req: any
    ) {
        const update = await this._attentionCardService.update(id, attentionCard);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'attention-card';
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
    async deleteAttentionCard(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        await this._attentionCardService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'attention-card';
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

    @Get('pdf/:id')
    async getPdf(@Param('id', ParseIntPipe) id: number): Promise<any> {
        const data = await this._attentionCardService.getPdfData(id);
        if (data) {
            const pdf = new PdfAttentionCard();
            return pdf.print(data);
        } else {
            throw new BadRequestException();
        }
    }
}
