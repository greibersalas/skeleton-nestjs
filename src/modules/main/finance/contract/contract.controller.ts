import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete, UseInterceptors, UploadedFile, HttpStatus, Res, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
const moment = require('moment-timezone');
const readXlsxFile = require('read-excel-file/node');
//Excel4Node
import * as xl from 'excel4node';

// Entity
import { Audit } from 'src/modules/security/audit/audit.entity';
import { Contract } from './entity/contract.entity';
import { ContractDetail } from './entity/contract-detail.entity';
import { ContractQuotaPayment } from './entity/contract-quota-payment.entity';

// Dto
import { ContractDto } from './dto/contract-dto';
import { ContractDetailDto } from './dto/contract-detail-dto';
import { PaymentDto } from './dto/payment-dto';

// Services
import { ContractService } from './contract.service';

// utils
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { KpiQuotaDto } from './dto/kpi-quota-detail-dto';
import { getMonthName } from 'src/utils/date.utils';
import { ContractQuotaPaymentDetail } from './entity/contract_quota_payment_detail.entity';

//PDF's
import { PdfContractChildren } from './pdf/pdf-contract-children';
import { PdfLetterCollection } from './pdf/pdf-letter-collection';

@UseGuards(JwtAuthGuard)
@Controller('contract')
export class ContractController {

    private module = 'contract';
    constructor(
        private service: ContractService
    ) { }

    @Get(':id')
    async getOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ContractDto> {
        return await this.service.getOne(id);
    }

    @Get('/detail/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ContractDetailDto[]> {
        return await this.service.getDataDetail(id);
    }

    @Get('/detail/for-payment/:id')
    async getDetailForPayment(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ContractDetailDto[]> {
        return await this.service.getDataDetailForPayment(id);
    }

    @Get()
    async getAll(): Promise<ContractDto[]> {
        return await this.service.getAll();
    }

    @Post('/filters')
    async getDataFilters(
        @Body() body: any
    ): Promise<ContractDto[]> {
        return await this.service.getDataFilters(body);
    }

    @Get('/clinic-history/:idclinichistory')
    async getDataByClinicHistory(
        @Param('idclinichistory', ParseIntPipe) idclinichistory: number
    ): Promise<ContractDto[]> {
        return await this.service.getDataByClinicHistory(idclinichistory);
    }

    @Post('/pending')
    async getDataFiltersPending(
        @Body() body: any
    ): Promise<ContractDto[]> {
        return await this.service.getDataFilters(body, 1);
    }

    @Post()
    async create(
        @Body() data: ContractDto,
        @Request() req: any
    ): Promise<Contract> {
        const order: Contract = new Contract();
        order.clinichistory = data.idclinichistory;
        order.type = data.type;
        order.date = data.date;
        order.duration = data.duration;
        order.amount = data.amount;
        order.quota = data.quota;
        order.exchange_house = data.exchange_house;
        order.exchange_house_url = data.exchange_house_url;
        order.amount = data.amount;
        order.num = data.num;
        order.amount_controls = data.amount_controls;
        order.user = Number(req.user.id);
        order.executive = data.executive;
        const create = await this.service.create(order);
        // Insertamos el detalle
        if (create) {
            for await (const item of data.detail) {
                const det: ContractDetail = new ContractDetail();
                det.contract = create;
                det.description = item.description;
                det.observation = item.observation;
                det.date = item.date;
                det.amount = item.amount;
                det.balance = item.balance;
                det.discount = item.discount;
                det.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
                det.user = Number(req.user.id);
                await this.service.insertDetail(det);
            }
        }
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

    @Post('/signature')
    async signature(
        @Body() data: any,
        @Request() req: any
    ): Promise<Contract> {
        const { signature, idcontract } = data;
        const saveSignature = await this.service.signature(Number(idcontract), signature);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = saveSignature.id;
        audit.title = this.module;
        audit.description = 'Registro de firma';
        audit.data = JSON.stringify(saveSignature);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return saveSignature;
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: Contract,
        @Request() req: any
    ) {
        const update = await this.service.update(id, data);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = this.module;
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
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        await this.service.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = this.module;
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

    @Get('/pdf/:idcontract')
    async getPdf(
        @Param('idcontract', ParseIntPipe) idcontract: number
    ): Promise<any> {
        const data = await this.service.getOne(idcontract);
        if (data) {
            const pdf = new PdfContractChildren();
            return pdf.print(data);
        } else {
            throw new BadRequestException();
        }
    }

    @Get('/pdf/letters/:type/:idcontract')
    async getPdfLetters(
        @Param('type') type: string,
        @Param('idcontract', ParseIntPipe) idcontract: number
    ): Promise<any> {
        const data = await this.service.getOne(idcontract);
        const detail = await this.service.getDataDetail(idcontract);
        if (data) {
            const pdf = new PdfLetterCollection();
            data.detail = detail;
            return pdf.print(data, type);
        } else {
            throw new BadRequestException();
        }
    }

    @Get('get-last/contract/number')
    async getLastCorrelative(): Promise<any> {
        let correlative = '';
        const num = await this.service.getLastCorrelative();

        correlative = `MX${moment().format('YY')}-${String(num + 1).padStart(4, '0')}`;;
        return { correlative, num };
    }

    // Payment
    @Post("/payment-quota/:id/:group")
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/contract/payment',
                filename: editFileName
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadFile(
        @UploadedFile() file: any,
        @Body() body: any,
        @Request() req: any
    ) {
        body = JSON.parse(body.body);
        let response = {};
        if (file) {
            response = {
                originalname: file.originalname,
                filename: file.filename,
                fileext: extname(file.originalname)
            };
        }
        //Data a guadar en la tabla
        const data: ContractQuotaPayment = new ContractQuotaPayment();
        data.payment_date = body.payment_date;
        data.coin = body.coin;
        data.amount = body.amount;
        data.observation = body.observation;
        data.bankaccount = body.bankaccount;
        data.exchangerate = body.exchangerate;
        data.contract = body.contract_detail[0].idcontract;
        data.file_name = file ? file.filename : null;
        data.file_ext = file ? extname(file.originalname) : null;
        data.user = Number(req.user.id);
        const insert = await this.service.insertPayment(data);
        if (insert) {
            for await (const iterator of body.contract_detail) {
                if (iterator.check) {
                    const paymenteDetail: ContractQuotaPaymentDetail = new ContractQuotaPaymentDetail();
                    paymenteDetail.contractdetail = iterator.id;
                    paymenteDetail.contractquotapayment = insert.id;
                    paymenteDetail.amount = iterator.balance;
                    paymenteDetail.save();
                    await this.service.updateDetailPayment(iterator.id, iterator);
                }
            }
        }
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = insert.id;
        audit.title = 'contract-quota-payment';
        audit.description = 'Insertar registro';
        audit.data = JSON.stringify(insert);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return {
            status: HttpStatus.OK,
            message: 'Image uploaded successfully!',
            data: response
        };
    }

    @Post('/payments')
    async getDataPaymentsFilters(
        @Body() body: any
    ): Promise<PaymentDto[]> {
        return await this.service.getPaymentList(body);
    }

    @Put('/payment/change-state/:id')
    async changeStatusPayment(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any,
        @Request() req: any
    ) {
        const user = Number(req.user.id);
        const update = await this.service.changeStatePayment(id, Number(data.state), user);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = this.module;
        audit.description = 'Change state payment';
        audit.data = JSON.stringify(update);
        audit.iduser = user;
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    // Detalle de un pago
    @Get('/payment/detail/:id')
    async getPaymentDetail(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PaymentDto> {
        const data = await this.service.getPaymentData(id);
        const detail = await this.service.getPaymentDetail(id);
        data.detail = detail;
        return data;
    }

    @Post('/kpi/quotas')
    async getOverdueQuota(
        @Body() body: any
    ): Promise<KpiQuotaDto> {
        const overdueQuota = await this.service.getOverdueQuota();
        const quotaExpiration = await this.service.getQuotaToExpiration();
        const kpiQuotaDetail = await this.service.getKpiQuotasDetail(body);
        return {
            overdueQuota,
            quotaExpiration,
            kpiQuotaDetail
        }
    }

    @Post('/kpi/get-resume-xlsx')
    async getReportResumeXlsx(
        @Res() response,
        @Body() filters: any
    ): Promise<any> {
        const data = await this.service.getDataQuotasDetailXls(filters);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(`DATA M.`);
        const styleTitle = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#ffffff',
                fgColor: '#989898',
            },
            font: {
                size: 14,
                bold: true
            },
            border: {
                outline: true,
                top: {
                    color: '#ffffff',
                }
            }
        });
        const styleTitleStatus = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#ffffff',
                fgColor: '#008000',
            },
            font: {
                size: 14,
                bold: true
            },
            border: {
                outline: true,
                top: {
                    color: '#ffffff',
                }
            }
        });
        ws.cell(1, 1, 1, 9, true)
            .string(`Datos generales`)
            .style(styleTitle);
        ws.cell(1, 10, 1, 22, true)
            .string(`Estatus de Cobranza`)
            .style(styleTitleStatus);

        const style = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#ffffff',
                fgColor: '#989898',
            },
            font: {
                color: '#ffffff',
                bold: true
            },
            border: {
                outline: true,
                top: {
                    color: '#ffffff',
                }
            }
        });
        const styleStatus = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#ffffff',
                fgColor: '#006400',
            },
            font: {
                color: '#ffffff',
                bold: true
            },
            border: {
                outline: true,
                top: {
                    color: '#ffffff',
                }
            }
        });
        ws.row(2).filter();
        ws.cell(2, 1)
            .string("Historia")
            .style(style);
        ws.cell(2, 2)
            .string("Cliente")
            .style(style);
        ws.cell(2, 3)
            .string("Paciente")
            .style(style);
        ws.cell(2, 4)
            .string("Ejecutivo")
            .style(style);
        ws.cell(2, 5)
            .string("Mes de contrato")
            .style(style);
        ws.cell(2, 6)
            .string("Año")
            .style(style);
        ws.cell(2, 7)
            .string("Presupuesto Total")
            .style(style);
        ws.cell(2, 8)
            .string("Cuota Inicial")
            .style(style);
        ws.cell(2, 9)
            .string("N° Cuotas Contrato")
            .style(style);
        ws.cell(2, 10)
            .string("Abonos Acumulados")
            .style(styleStatus);
        ws.cell(2, 11)
            .string("Saldo por Cobrar")
            .style(styleStatus);
        ws.cell(2, 12)
            .string("Importe de cuota (Contrato)")
            .style(styleStatus);
        ws.cell(2, 13)
            .string("Tipo de cartera")
            .style(styleStatus);
        ws.cell(2, 14)
            .string("Matriz de Seg")
            .style(styleStatus);
        ws.cell(2, 15)
            .string("Segmentación")
            .style(styleStatus);
        ws.cell(2, 16)
            .string("N° de cuota")
            .style(styleStatus);
        ws.cell(2, 17)
            .string("Fecha Venc. Cuota")
            .style(styleStatus);
        ws.cell(2, 18)
            .string("N° de Cuota")
            .style(styleStatus);
        ws.cell(2, 19)
            .string("Días de Moridad")
            .style(styleStatus);
        ws.cell(2, 20)
            .string("Clasificacion")
            .style(styleStatus);
        ws.cell(2, 21)
            .string("Ejecución")
            .style(styleStatus);
        ws.cell(2, 22)
            .string("Etapas")
            .style(styleStatus);
        // size columns
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(30);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(10);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(20);
        ws.column(10).setWidth(20);
        ws.column(11).setWidth(20);
        ws.column(12).setWidth(25);
        ws.column(13).setWidth(20);
        ws.column(14).setWidth(20);
        ws.column(15).setWidth(20);
        ws.column(16).setWidth(20);
        ws.column(17).setWidth(20);
        ws.column(18).setWidth(20);
        ws.column(19).setWidth(20);
        ws.column(20).setWidth(20);
        ws.column(21).setWidth(20);
        ws.column(22).setWidth(20);
        let y = 3;
        data.map((it: any) => {
            const {
                history,
                patient,
                attorney,
                contract_date,
                contract_amount,
                contract_quota,
                initial_amount,
                payment,
                date_quota,
                executive,
                amountQuota,
                etapas
            } = it;
            const moridad = moment().diff(moment(date_quota), 'days');
            ws.cell(y, 1)
                .string(`${history}`); // Nro de historia
            ws.cell(y, 2)
                .string(`${attorney ? attorney : ''}`); // Cliente
            ws.cell(y, 3)
                .string(`${patient}`); // Paciente
            ws.cell(y, 4)
                .string(`${executive}`); // Ejecutivo
            ws.cell(y, 5)
                .string(`${getMonthName(Number(moment(contract_date).format('M')))}`); // Mes de contrato
            ws.cell(y, 6)
                .number(Number(moment(contract_date).format('YYYY'))); // año
            ws.cell(y, 7)
                .number(Number(contract_amount.toFixed(2))); // Presupuesto Total
            ws.cell(y, 8)
                .number(Number(initial_amount.toFixed(2))); // Cuota Inicial
            ws.cell(y, 9)
                .number(Number(contract_quota.toFixed(2))); // N° Cuotas Contrato
            const abonos = payment ? Number(payment.toFixed(2)) : 0;
            ws.cell(y, 10)
                .number(abonos); // Abonos Acumulados
            ws.cell(y, 11)
                .formula(`G${y}-J${y}`); // Saldo por Cobrar
            ws.cell(y, 12)
                .string(Number(amountQuota)); // Importe quota
            ws.cell(y, 13)
                .string(this.getTipoCartera(moridad)); // Tipo de cartera
            ws.cell(y, 15)
                .string(this.getSegmentacion(moridad)); // Segmentación|
            ws.cell(y, 16)
                .string(''); // N° de cuota
            ws.cell(y, 17)
                .date(new Date(date_quota)).style({ numberFormat: 'dd/mm/yyyy' }); // Fecha Venc. Cuota
            ws.cell(y, 18)
                .string(''); // N° de Cuota
            ws.cell(y, 19)
                .number(Number(moridad)); // Días de Moridad
            ws.cell(y, 22)
                .string(etapas); // Etapas
            y++;
        });
        await wb.writeToBuffer().then(function (buffer: any) {
            response.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=reporte-cobranza.xlsx',
                'Content-Length': buffer.length
            })

            response.end(buffer);
        });
    }

    getTipoCartera = (moridad: number): string => {
        if (moridad <= 0) {
            return 'POR VENCER';
        }
        if (moridad >= 1 && moridad <= 30) {
            return 'VENCIDO';
        }
        if (moridad >= 31) {
            return 'MOROSA';
        }
        return ''
    }

    getSegmentacion(moridad: number): string {
        const S3 = Number(moridad);
        const M3 = this.getTipoCartera(moridad);
        let resultado = '';
        if (S3 >= 31 && S3 <= 60 && M3 == 'MOROSA') {
            resultado = '+30 DÍAS';
        } else if (S3 >= 61 && S3 <= 90 && M3 == 'MOROSA') {
            resultado = '+60 DÍAS';
        } else if (S3 >= 91 && M3 == 'MOROSA') {
            resultado = '+90 DÍAS';
        } else if (S3 >= 1 && S3 <= 30 && M3 == 'VENCIDO') {
            resultado = '+1 DÍAS';
        } else {
            resultado = 'ANTES DEL VENCIMIENTO';
        }
        return resultado;
    }

    @Get('get/xlsx/')
    async getXlsx(
        @Res() response,
        @Request() req: any
    ): Promise<any> {
        await readXlsxFile(`${__dirname}/../../../../../uploads/contratos.xlsx`).then(async (rows: any) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            rows.shift();
            const resp = await this.service.regularNumDoc(rows, Number(req.user.id));
            return response.status(HttpStatus.OK).json(resp);

        });
    }

    @Get('get/state_contract')
    async _getDataStateContract(@Res() response, @Request() req: any): Promise<any> {
        const resp = await this.service.getDataStateContract();
        return response.status(HttpStatus.OK).json(resp);
    }

    @Put('get/update_state_contract')
    async updateStateContract(@Body() data: { idcontract: number, id_state_contract: number }) {
        return await this.service.updateStateContract(data)
    }
}

