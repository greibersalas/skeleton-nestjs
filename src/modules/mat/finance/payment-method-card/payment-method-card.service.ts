import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethodCard } from './entity/payment-method-card.entity';

@Injectable()
export class PaymentMethodCardService {

    constructor(
        @InjectRepository(PaymentMethodCard)
        private readonly repository: Repository<PaymentMethodCard>
    ) { }

    async get(id: number): Promise<PaymentMethodCard> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }
        const data = await this.repository.findOne(id);
        if (!data) {
            throw new NotFoundException();
        }
        return data;
    }

    async getAll(): Promise<PaymentMethodCard[]> {
        return await this.repository.find({
            where: { status: 1 },
            order: { name: 'ASC' }
        });
    }

    async create(PaymentMethodCard: PaymentMethodCard): Promise<PaymentMethodCard> {
        return await this.repository.save(PaymentMethodCard);
    }

    async update(id: number, data: PaymentMethodCard): Promise<PaymentMethodCard> {
        const card = await this.repository.findOne(id);
        if (!card) {
            throw new NotFoundException();
        }
        await this.repository.update(id, data);
        return await this.repository.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const bank = await this.repository.findOne(id);
        if (!bank) {
            throw new NotFoundException();
        }
        await this.repository.update(id, { status: 0 });
    }
}
