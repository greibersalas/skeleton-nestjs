import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';

import { Audit } from './audit.entity';

//Servicios
import { AuditService } from './audit.service';
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {

    constructor(private readonly _AuditService: AuditService){}

    @Get(':id/:module')
    async getProvinces(
        @Param('id',ParseIntPipe) id: number,
        @Param('module') module: string,
    ): Promise<Audit[]>{
        return await this._AuditService.get(id, module);
    }
}
