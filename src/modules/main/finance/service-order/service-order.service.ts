import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const moment = require('moment-timezone');

import { ServiceOrderDto } from './dto/service-order-dto';
import { ViewServiceOrder } from './entity/service-order-view.entity';



@Injectable()
export class ServiceOrderService {

    constructor(
        @InjectRepository(ViewServiceOrder)
        private readonly repository: Repository<ViewServiceOrder>,
    ) { }

    async getDataPending(date: string): Promise<ServiceOrderDto[]> {
        return this.repository.createQueryBuilder('so')
            .select('*')
            .where(`so.date = '${date}'`)
            .andWhere('so.status = 1')
            .orderBy('so.id', 'ASC')
            .getRawMany();
    }

}
