import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../security/audit/audit.entity';
import { AttentionCard } from './attention-card.entity';
import { AttentionCardService } from './attention-card.service';
//FPDF
const FPDF = require('node-fpdf');

@UseGuards(JwtAuthGuard)
@Controller('attentioncard')
export class AttentionCardController {
    constructor(private readonly _attentionCardService: AttentionCardService){}

    @Get('history/:id')
    async getByClinicHistory(@Param('id',ParseIntPipe) id: number): Promise<AttentionCard>{
        const attentionCard = await this._attentionCardService.getByClinicHistory(id);
        return attentionCard;
    }

    @Get(':id')
    async getAttentionCard(@Param('id',ParseIntPipe) id: number): Promise<AttentionCard>{
        const attentionCard = await this._attentionCardService.get(id);
        return attentionCard;
    }

    @Get()
    async getAttentionCards(): Promise<AttentionCard[]>{
        const attentionCard = await this._attentionCardService.getAll();
        return attentionCard;
    }

    @Post()
    async createAttentionCard(
        @Body() attentionCard: AttentionCard,
        @Request() req: any
    ): Promise<AttentionCard>{
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
        @Param('id',ParseIntPipe) id: number,
        @Body() attentionCard: AttentionCard,
        @Request() req: any
    ){
        const update = await this._attentionCardService.update(id,attentionCard);
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
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
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
    async getPdf(@Param('id',ParseIntPipe) id: number): Promise<any>{
        const data = await this._attentionCardService.getPdfData(id);
        //console.log("data ",data);
        const pdf = new FPDF('P','mm','A4');
        pdf.AddPage('P','A4');
        pdf.SetTitle('Ficha de evaluacion de ingreso');
        pdf.SetFillColor(200,200,200);

        pdf.Image('assets/img/logo.jpg',10,10,60,25,'jpg');

        pdf.SetFont('Arial','',16);
        pdf.SetY(10);
        pdf.SetX(110);
        pdf.Cell(90,20,'',1);
        pdf.SetY(13);
        pdf.SetX(115);
        pdf.MultiCell(75,8,'FICHA DE EVALUACIÓN DE INGRESO',0,'C');

        pdf.SetFont('Arial','',10);
        pdf.SetY(60);
        pdf.SetX(10);
        pdf.Cell(100,5,`FECHA DE INGRESO: ${moment(data.dateadmission).tz('America/Lima').format('DD-MM-YYYY')}`);

        pdf.SetY(80);
        pdf.SetX(10);
        pdf.Cell(100,5,`PACIENTE: ${data.clinichistory.name} ${data.clinichistory.lastNameFather} ${data.clinichistory.lastNameMother}`);
        pdf.SetY(80);
        pdf.SetX(120);
        pdf.Cell(50,5,`HISTORIA: ${data.clinichistory.history}`);

        pdf.SetY(100);
        pdf.SetX(10);
        pdf.Cell(50,5,'MOTIVO DE LA CONSULTA:');
        pdf.SetY(105);
        pdf.SetX(10);
        pdf.MultiCell(200,5,`${data.motivo}`);

        pdf.SetY(120);
        pdf.SetX(10);
        pdf.Cell(50,5,'DIAGNÓSTICOS:');

        pdf.SetY(130);
        pdf.SetX(10);
        pdf.MultiCell(25,5,'Moloclusión Apiñamiento');
        pdf.SetY(130);
        pdf.SetX(45);
        pdf.Cell(15,10,'',1);
        if(data.ma){
            pdf.SetFont('Arial','',16);
            pdf.SetY(133);
            pdf.SetX(45);
            pdf.Cell(15,5,'X',0,0,'C');
        }
        pdf.SetFont('Arial','',10);
        pdf.SetY(130);
        pdf.SetX(105);
        pdf.MultiCell(25,5,'DTM');
        pdf.SetY(130);
        pdf.SetX(150);
        pdf.Cell(15,10,'',1);
        if(data.dtm){
            pdf.SetFont('Arial','',16);
            pdf.SetY(133);
            pdf.SetX(150);
            pdf.Cell(15,5,'X',0,0,'C');
        }
        pdf.SetFont('Arial','',10);

        pdf.SetY(150);
        pdf.SetX(10);
        pdf.MultiCell(25,5,'Moloclusión Mandíbula pequeña');
        pdf.SetY(150);
        pdf.SetX(45);
        pdf.Cell(15,10,'',1);
        if(data.mmp){
            pdf.SetFont('Arial','',16);
            pdf.SetY(153);
            pdf.SetX(45);
            pdf.Cell(15,5,'X',0,0,'C');
        }
        pdf.SetFont('Arial','',10);
        pdf.SetY(150);
        pdf.SetX(105);
        pdf.MultiCell(25,5,'Moloclusión Mordida abierta');
        pdf.SetY(150);
        pdf.SetX(150);
        pdf.Cell(15,10,'',1);
        if(data.mm){
            pdf.SetFont('Arial','',16);
            pdf.SetY(153);
            pdf.SetX(150);
            pdf.Cell(15,5,'X',0,0,'C');
        }
        pdf.SetFont('Arial','',10);

        pdf.SetY(170);
        pdf.SetX(10);
        pdf.MultiCell(25,5,'Moloclusión prognatismo');
        pdf.SetY(170);
        pdf.SetX(45);
        pdf.Cell(15,10,'',1);
        if(data.mp){
            pdf.SetFont('Arial','',16);
            pdf.SetY(173);
            pdf.SetX(45);
            pdf.Cell(15,5,'X',0,0,'C');
        }
        pdf.SetFont('Arial','',10);
        pdf.SetY(170);
        pdf.SetX(105);
        pdf.MultiCell(25,5,'Asimetría facial');
        pdf.SetY(170);
        pdf.SetX(150);
        pdf.Cell(15,10,'',1);
        if(data.af){
            pdf.SetFont('Arial','',16);
            pdf.SetY(173);
            pdf.SetX(150);
            pdf.Cell(15,5,'X',0,0,'C');
        }
        pdf.SetFont('Arial','',10);

        pdf.SetY(190);
        pdf.SetX(10);
        pdf.MultiCell(25,5,'Apnea y Ronquidos');
        pdf.SetY(190);
        pdf.SetX(45);
        pdf.Cell(15,10,'',1);
        if(data.ar){
            pdf.SetFont('Arial','',16);
            pdf.SetY(193);
            pdf.SetX(45);
            pdf.Cell(15,5,'X',0,0,'C');
        }
        pdf.SetFont('Arial','',10);

        pdf.SetY(190);
        pdf.SetX(105);
        pdf.MultiCell(25,5,'Apnea del sueño CPAP');
        pdf.SetY(190);
        pdf.SetX(150);
        pdf.Cell(15,10,'',1);
        if(data.asc){
            pdf.SetFont('Arial','',16);
            pdf.SetY(193);
            pdf.SetX(150);
            pdf.Cell(15,5,'X',0,0,'C');
        }
        pdf.SetFont('Arial','',10);

        pdf.SetY(210);
        pdf.SetX(10);
        pdf.MultiCell(25,5,'Dientes chuecos Brackets');
        pdf.SetY(210);
        pdf.SetX(45);
        pdf.Cell(15,10,'',1);
        if(data.dcb){
            pdf.SetFont('Arial','',16);
            pdf.SetY(213);
            pdf.SetX(45);
            pdf.Cell(15,5,'X',0,0,'C');
        }

        pdf.SetFont('Arial','',7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);

        const nameFile: string = `attention-card-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/clinichistory/${nameFile}`);
        let response = {link: `pdf/clinichistory/${nameFile}`}
        return response;
    }
}
