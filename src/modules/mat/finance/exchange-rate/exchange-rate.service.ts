import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from './entity/exchange-rate.entity';
import { ExchangeRateDto } from './dto/exchange-rate-dto';

@Injectable()
export class ExchangeRateService {

    constructor(
        @InjectRepository(ExchangeRate)
        private readonly repository: Repository<ExchangeRate>
    ) { }

    async get(id: number): Promise<ExchangeRateDto> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }

        const ExchangeRate = await this.repository.createQueryBuilder('er')
            .select(`er.id, er.value, er.date, er.state,
            er.coins as idcoin, co.code AS coin,
            er.idexchangehouse, eh.name AS exchangehouse`)
            .innerJoin('coin', 'co', `co.id = er.coins`)
            .leftJoin('exchange_house', 'eh', `eh.id = er.idexchangehouse`)
            .where(`er.id = ${id}`)
            .getRawOne();

        if (!ExchangeRate) {
            throw new NotFoundException();
        }

        return ExchangeRate;
    }

    async getLast(): Promise<ExchangeRateDto> {
        const ExchangeRate = await this.repository.createQueryBuilder('er')
            .select(`er.id, er.value, er.date, er.state,
                er.coins as idcoin, co.code AS coin,
                er.idexchangehouse, eh.name AS exchangehouse`)
            .innerJoin('coin', 'co', `co.id = er.coins`)
            .leftJoin('exchange_house', 'eh', `eh.id = er.idexchangehouse`)
            .where(`er.state = 1`)
            .orderBy('er.id', 'DESC')
            .getRawOne();

        if (!ExchangeRate) {
            throw new NotFoundException();
        }

        return ExchangeRate;
    }

    async getAll(): Promise<ExchangeRateDto[]> {
        return await this.repository.createQueryBuilder('er')
            .select(`er.id, er.value, er.date, er.state,
            er.coins as idcoin, co.code AS coin,
            er.idexchangehouse, eh.name AS exchangehouse`)
            .innerJoin('coin', 'co', `co.id = er.coins`)
            .leftJoin('exchange_house', 'eh', `eh.id = er.idexchangehouse`)
            .where(`er.state <> 0`)
            .orderBy('er.id', 'DESC')
            .getRawMany();
    }

    async create(data: ExchangeRate): Promise<ExchangeRate> {
        return await this.repository.save(data);
    }

    async update(id: number, data: ExchangeRateDto, iduser: number): Promise<ExchangeRate> {
        const item = await this.repository.findOne(id);
        if (!item) {
            throw new NotFoundException();
        }
        item.coins = data.idcoin;
        item.value = data.value;
        item.date = data.date;
        item.exchangehouse = data.idexchangehouse;
        item.user = iduser;
        await this.repository.update(id, item);
        return await this.repository.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const ExchangeRateExists = await this.repository.findOne(id);
        if (!ExchangeRateExists) {
            throw new NotFoundException();
        }

        await this.repository.update(id, { state: 0 });
    }
}
