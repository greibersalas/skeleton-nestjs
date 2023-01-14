import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccountsDto } from './dto/bank-accounts-dto';
import { BankAccounts } from './entity/bank-accounts.entity';

@Injectable()
export class BankAccountsService {

    constructor(
        @InjectRepository(BankAccounts)
        private readonly repository: Repository<BankAccounts>
    ) { }

    async get(id: number): Promise<BankAccounts> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }
        const data = await this.repository.findOne(id);
        if (!data) {
            throw new NotFoundException();
        }
        return data;
    }

    async getAll(): Promise<BankAccounts[]> {
        const data: BankAccounts[] = await this.repository.find({
            where: { status: 1 },
            order: { bank: 'ASC' }
        });
        return data;
    }

    async create(bankAccounts: BankAccounts): Promise<BankAccounts> {
        return await this.repository.save(bankAccounts);
    }

    async update(id: number, data: BankAccounts): Promise<BankAccounts> {
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
        await this.repository.update(id, { status: 0 });
    }
}
