import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExchangeHouse } from './entity/exchange-house.entity';
import { ExchangeHouseDto } from './dto/exchange-house-dto';

@Injectable()
export class ExchangeHouseService {

    constructor(
        @InjectRepository(ExchangeHouse)
        private readonly repository: Repository<ExchangeHouse>
    ) { }

    async get(id: number): Promise<ExchangeHouse> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }
        const data = await this.repository.findOne(id);
        if (!data) {
            throw new NotFoundException();
        }
        return data;
    }

    async getAll(): Promise<ExchangeHouse[]> {
        const data: ExchangeHouse[] = await this.repository.find({
            where: { status: 1 },
            order: { name: 'ASC' }
        });
        return data;
    }

    async create(data: ExchangeHouse): Promise<ExchangeHouse> {
        return await this.repository.save(data);
    }

    async update(id: number, data: ExchangeHouse): Promise<ExchangeHouse> {
        const item = await this.repository.findOne(id);
        if (!item) {
            throw new NotFoundException();
        }
        await this.repository.update(id, data);
        return await this.repository.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const item = await this.repository.findOne(id);
        if (!item) {
            throw new NotFoundException();
        }
        await this.repository.update(id, { status: 0 });
    }
}
