import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    Request,
    Put,
    Delete
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

import { Audit } from 'src/modules/security/audit/audit.entity';
import { ExchangeHouseService } from './exchange-house.service';
import { ExchangeHouseDto } from './dto/exchange-house-dto';
import { ExchangeHouse } from './entity/exchange-house.entity';

@UseGuards(JwtAuthGuard)
@Controller('exchange-house')
export class ExchangeHouseController {

    private module = 'exchange-house';
    constructor(
        private service: ExchangeHouseService
    ) { }

    @Get(':id')
    async getBank(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ExchangeHouseDto> {
        const data = await this.service.get(id);
        let item: ExchangeHouseDto;
        item.id = data.id;
        item.name = data.name;
        item.status = data.status;
        return item
    }

    @Get()
    async getBanks(): Promise<ExchangeHouseDto[]> {
        const data = await this.service.getAll();
        return data.map(el => {
            let item: ExchangeHouseDto;
            item = {
                id: el.id,
                name: el.name,
                status: el.status
            }
            return item;
        });
    }

    @Post()
    async create(
        @Body() data: ExchangeHouse,
        @Request() req: any
    ): Promise<ExchangeHouse> {
        data.user = req.user.id;
        const create = await this.service.create(data);
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
        @Body() body: ExchangeHouse
    ) {
        return await this.service.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
