import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entity
import { ServiceOrder } from './entity/service-order.entity';

@Injectable()
export class ServiceOrderService {

    constructor(
        @InjectRepository(ServiceOrder)
        private readonly repository: Repository<ServiceOrder>
    ) { }

    async getOne(id: number): Promise<ServiceOrder> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }

        const data = await this.repository.findOne(id, { where: { state: 1 } });

        if (!data) {
            throw new NotFoundException();
        }

        return data;
    }

    async getAll(): Promise<ServiceOrder[]> {
        return await this.repository.find({ where: { state: 1 } });
    }

    async create(data: ServiceOrder): Promise<ServiceOrder> {
        return await this.repository.save(data);
    }

    async update(id: number, data: ServiceOrder): Promise<ServiceOrder> {
        const exists = await this.repository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.repository.update(id, data);
        return await this.repository.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const exists = await this.repository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }

        await this.repository.update(id, { state: 0 });
    }
}
