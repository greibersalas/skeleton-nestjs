import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

// Entity
import { Audit } from 'src/modules/security/audit/audit.entity';
// Dto
import { ServiceOrderDto } from './dto/service-order-dto';

// Service
import { ServiceOrderService } from './service-order.service';

@UseGuards(JwtAuthGuard)
@Controller('service-order')
export class ServiceOrderController {

    private module = 'service-order';
    constructor(
        private service: ServiceOrderService
    ) { }

    @Get('/pending/:date')
    async getDataPending(
        @Param('date') date: string
    ): Promise<ServiceOrderDto[]> {
        return await this.service.getDataPending(date);
    }

}
