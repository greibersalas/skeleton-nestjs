import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
var moment = require('moment-timezone');

// Guards
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';

// Entities
import { Audit } from 'src/modules/security/audit/audit.entity';

// DTO's
import { PendingPaymentDto } from './dto/pending-payment.dto';

// Services
import { ErpService } from './erp.service';

@UseGuards(JwtAuthGuard)
@Controller('erp')
export class ErpController {
    constructor(
        private readonly _erpService: ErpService
    ){}

    @Get('pending-payment/:nro_doc')
    async getCampus(
        @Param('nro_doc') nro_doc: string,
        @Request() req: any
    ): Promise<PendingPaymentDto[]>{
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = 0;
        audit.title = 'api-erp';
        audit.description = 'Get data';
        audit.data = JSON.stringify({dni: nro_doc});
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return await this._erpService.getPendingPayment(nro_doc);
    }
}
