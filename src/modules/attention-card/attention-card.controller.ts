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
        //console.log("data ",data);
        const pdf = new FPDF('P', 'mm', 'A4');
        pdf.AddPage('P', 'A4');
        pdf.SetTitle('Ficha de evaluacion de ingreso');
        pdf.SetFillColor(200, 200, 200);

        pdf.Image('assets/img/logo.jpg', 10, 10, 60, 25, 'jpg');

        pdf.SetFont('Arial', '', 16);
        pdf.SetY(10);
        pdf.SetX(110);
        pdf.Cell(90, 20, '', 1);
        pdf.SetY(13);
        pdf.SetX(115);
        pdf.MultiCell(75, 8, 'FICHA DE EVALUACIÓN DE INGRESO', 0, 'C');

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(60);
        pdf.SetX(10);
        pdf.Cell(100, 5, `FECHA DE INGRESO: ${moment(data.dateadmission).tz('America/Lima').format('DD-MM-YYYY')}`);

        pdf.SetY(80);
        pdf.SetX(10);
        pdf.Cell(100, 5, `PACIENTE: ${data.clinichistory.name} ${data.clinichistory.lastNameFather} ${data.clinichistory.lastNameMother}`);
        pdf.SetY(80);
        pdf.SetX(120);
        pdf.Cell(50, 5, `HISTORIA: ${data.clinichistory.history}`);

        pdf.SetY(90);
        pdf.SetX(10);
        pdf.Cell(50, 5, 'MOTIVO DE LA CONSULTA:');
        pdf.SetY(95);
        pdf.SetX(10);
        pdf.MultiCell(200, 5, `${data.motivo}`);

        pdf.SetY(130);
        pdf.SetX(10);
        pdf.Cell(50, 5, 'DIAGNÓSTICOS:');

        pdf.SetY(140);
        pdf.SetX(10);
        pdf.MultiCell(25, 5, 'Moloclusión Apiñamiento');
        pdf.SetY(140);
        pdf.SetX(45);
        pdf.Cell(15, 10, '', 1);
        if (data.ma) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(143);
            pdf.SetX(45);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(140);
        pdf.SetX(105);
        pdf.MultiCell(25, 5, 'DTM');
        pdf.SetY(140);
        pdf.SetX(150);
        pdf.Cell(15, 10, '', 1);
        if (data.dtm) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(143);
            pdf.SetX(150);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }
        pdf.SetFont('Arial', '', 10);

        pdf.SetY(160);
        pdf.SetX(10);
        pdf.MultiCell(25, 5, 'Moloclusión Mandíbula pequeña');
        pdf.SetY(160);
        pdf.SetX(45);
        pdf.Cell(15, 10, '', 1);
        if (data.mmp) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(163);
            pdf.SetX(45);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(160);
        pdf.SetX(105);
        pdf.MultiCell(25, 5, 'Moloclusión Mordida abierta');
        pdf.SetY(160);
        pdf.SetX(150);
        pdf.Cell(15, 10, '', 1);
        if (data.mm) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(163);
            pdf.SetX(150);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }
        pdf.SetFont('Arial', '', 10);

        pdf.SetY(180);
        pdf.SetX(10);
        pdf.MultiCell(25, 5, 'Moloclusión prognatismo');
        pdf.SetY(180);
        pdf.SetX(45);
        pdf.Cell(15, 10, '', 1);
        if (data.mp) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(183);
            pdf.SetX(45);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(180);
        pdf.SetX(105);
        pdf.MultiCell(25, 5, 'Asimetría facial');
        pdf.SetY(180);
        pdf.SetX(150);
        pdf.Cell(15, 10, '', 1);
        if (data.af) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(183);
            pdf.SetX(150);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }
        pdf.SetFont('Arial', '', 10);

        pdf.SetY(200);
        pdf.SetX(10);
        pdf.MultiCell(25, 5, 'Apnea y Ronquidos');
        pdf.SetY(200);
        pdf.SetX(45);
        pdf.Cell(15, 10, '', 1);
        if (data.ar) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(203);
            pdf.SetX(45);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }
        pdf.SetFont('Arial', '', 10);

        pdf.SetY(200);
        pdf.SetX(105);
        pdf.MultiCell(25, 5, 'Apnea del sueño CPAP');
        pdf.SetY(200);
        pdf.SetX(150);
        pdf.Cell(15, 10, '', 1);
        if (data.asc) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(203);
            pdf.SetX(150);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }
        pdf.SetFont('Arial', '', 10);

        pdf.SetY(220);
        pdf.SetX(10);
        pdf.MultiCell(25, 5, 'Dientes chuecos Brackets');
        pdf.SetY(220);
        pdf.SetX(45);
        pdf.Cell(15, 10, '', 1);
        if (data.dcb) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(223);
            pdf.SetX(45);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15, 5, `Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);
        pdf.SetY(270);
        pdf.SetX(10);
        pdf.Cell(190, 5, `Página - 1`, 0, 0, 'C');

        /* Página 2 */
        pdf.AddPage('P', 'A4');
        pdf.SetTitle('Ficha de evaluacion de ingreso');
        pdf.SetFillColor(200, 200, 200);

        pdf.Image('assets/img/logo.jpg', 10, 10, 60, 25, 'jpg');

        pdf.SetFont('Arial', '', 16);
        pdf.SetY(10);
        pdf.SetX(110);
        pdf.Cell(90, 20, '', 1);
        pdf.SetY(13);
        pdf.SetX(115);
        pdf.MultiCell(75, 8, 'FICHA DE EVALUACIÓN DE INGRESO', 0, 'C');

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(40);
        pdf.SetX(10);
        pdf.Cell(90, 5, `Diagnostico clínico dentario`, 0, 0, 'C');
        pdf.Cell(90, 5, `Diagnostico clínico oseo esqueletico`, 0, 0, 'C');


        /* Seccion 1 */
        pdf.SetY(50);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida cruzada anterior');
        pdf.SetY(50);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_cruzada_a) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(53);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(50);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Asimetria facial');
        pdf.SetY(50);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.asimetria_facial) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(53);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 2 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(60);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida cruzada posterior');
        pdf.SetY(60);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_cruzada_p) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(63);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(60);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Retrusión maxilar');
        pdf.SetY(60);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.retrusion_maxilar) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(63);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 3 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(70);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida clase I');
        pdf.SetY(70);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_clase_i) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(73);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(70);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Retrusión mandibular');
        pdf.SetY(70);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.retrusion_mandibular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(73);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 4 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(80);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida clase II');
        pdf.SetY(80);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_clase_ii) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(83);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(80);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Protusión maxilar');
        pdf.SetY(80);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.protusion_maxilar) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(83);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 5 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(90);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida clase III');
        pdf.SetY(90);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_clase_iii) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(93);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(90);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Prognatismo mandibular');
        pdf.SetY(90);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.prognotismo_mandibular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(93);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 6 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(100);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida profunda');
        pdf.SetY(100);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_profunda) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(103);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(100);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Desviación mandibular');
        pdf.SetY(100);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_mandibular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(103);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 7 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(110);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida abierta');
        pdf.SetY(110);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_abierta) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(113);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(110);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Biprotrusión');
        pdf.SetY(110);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.biprotrusion) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(113);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 8 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(120);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida en tijera');
        pdf.SetY(120);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_tijera) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(123);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(120);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Biretrusión');
        pdf.SetY(120);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.biretrusion) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(123);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 9 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(130);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Apiñamiento dental');
        pdf.SetY(130);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.apinamiento_dental) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(133);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(130);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Atresia maxilar');
        pdf.SetY(130);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.atresia_maxilar) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(133);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 10 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(140);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Inclinación plano oclusal');
        pdf.SetY(140);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.inclinacion_plano_oclusal) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(143);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(140);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Fisura labio palatina');
        pdf.SetY(140);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.fisura_labio_palatina) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(143);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 11 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(150);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Desviación lineal media superior derecha');
        pdf.SetY(150);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_media_sd) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(153);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(150);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'DTM - Articular');
        pdf.SetY(150);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.dtm_articular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(153);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 12 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(160);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Desviación lineal media superior izquierda');
        pdf.SetY(160);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_media_si) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(163);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(160);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'DTM - Muscular');
        pdf.SetY(160);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.dtm_muscular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(163);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 13 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(170);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Desviación lineal media inferior derecha');
        pdf.SetY(170);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_media_id) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(173);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(170);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Cefalea atribuida a DTM');
        pdf.SetY(170);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.cefalea_atribuida) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(173);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        /* Seccion 14 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(180);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Desviación lineal media inferior izquierda');
        pdf.SetY(180);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_media_ii) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(183);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(180);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Sumbido somato sensorial');
        pdf.SetY(180);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.sumbido_somato) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(183);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15, 5, `Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);
        pdf.SetY(270);
        pdf.SetX(10);
        pdf.Cell(190, 5, `Página - 2`, 0, 0, 'C');

        const nameFile: string = `attention-card-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F', `uploads/pdf/clinichistory/${nameFile}`);
        let response = { link: `pdf/clinichistory/${nameFile}` }
        return response;
    }
}
