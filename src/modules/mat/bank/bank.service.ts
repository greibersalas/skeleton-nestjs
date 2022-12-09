import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankDto } from './dto/bank-dto';
import { Bank } from './entity/bank.entity';

@Injectable()
export class BankService {

    constructor(
        @InjectRepository(Bank)
        private readonly repository: Repository<Bank>
    ) { }

    async get(id: number): Promise<BankDto> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }
        const data = await this.repository.findOne(id);
        if (!data) {
            throw new NotFoundException();
        }
        return data;
    }

    async getAll(): Promise<BankDto[]> {
        const data: BankDto[] = await this.repository.find({
            where: { state: 1 },
            order: { name: 'ASC' }
        });
        return data;
    }

    async create(bank: Bank): Promise<BankDto> {
        return await this.repository.save(bank);
    }

    async update(id: number, data: Bank): Promise<BankDto> {
        const bank = await this.repository.findOne(id);
        if (!bank) {
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
        await this.repository.update(id, { state: 0 });
    }
}
