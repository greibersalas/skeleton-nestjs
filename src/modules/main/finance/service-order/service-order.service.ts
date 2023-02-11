import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalActAttention } from '../../medical-act-attention/medical-act-attention.entity';

import { ServiceOrderDto } from './dto/service-order-dto';
import { ViewServiceOrder } from './entity/service-order-view.entity';



@Injectable()
export class ServiceOrderService {

    constructor(
        @InjectRepository(ViewServiceOrder)
        private readonly repository: Repository<ViewServiceOrder>,
        @InjectRepository(MedicalActAttention)
        private readonly repositoryAttention: Repository<MedicalActAttention>,
    ) { }

    async getDataPending(date: string): Promise<ServiceOrderDto[]> {
        return this.repository.createQueryBuilder('so')
            .select('*')
            .where(`so.date = '${date}'`)
            .andWhere('so.status = 1')
            .orderBy('so.id', 'ASC')
            .getRawMany();
    }

    async setPaymentData(id: number, data: ServiceOrderDto): Promise<boolean> {
        const attention = await this.repositoryAttention.findOne({ id });
        if (!attention) {
            throw new NotFoundException();
        }
        attention.idpaymentmethod = data.idpaymentmethod;
        attention.bankaccount = data.idbankaccount;
        attention.operation_number = data.operation_number;
        attention.document_type = data.document_type;
        attention.document_number = data.document_number;
        attention.document_date = data.document_date;
        attention.state = 2;
        if (attention.save()) {
            return true;
        } else {
            return false;
        }
    }

    async setDecline(id: number): Promise<boolean> {
        const attention = await this.repositoryAttention.findOne({ id });
        if (!attention) {
            throw new NotFoundException();
        }
        attention.state = 3;
        if (attention.save()) {
            return true;
        } else {
            return false;
        }
    }

}
