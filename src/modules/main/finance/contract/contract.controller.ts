import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
const moment = require('moment-timezone');

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
        data.file_name = file ? file.filename : null;
        data.file_ext = file ? extname(file.originalname) : null;
        data.user = Number(req.user.id);
        const insert = await this.service.insertPayment(data);
        if (insert) {
            for await (const iterator of body.contract_detail) {
                if (iterator.check) {
                    await this.service.updateDetailPayment(iterator.id, insert.id);
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

    @Get('/kpi/quotas')
    async getOverdueQuota(): Promise<KpiQuotaDto> {
        const overdueQuota = await this.service.getOverdueQuota();
        const quotaExpiration = await this.service.getQuotaToExpiration();
        const kpiQuotaDetail = await this.service.getKpiQuotasDetail();
        return {
            overdueQuota,
            quotaExpiration,
            kpiQuotaDetail
        }
    }
}

