import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
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

    async getLast(): Promise<ExchangeRateDto[]> {
        const ExchangeRate = await this.repository.createQueryBuilder('er')
            .select(`er.id, er.value, er.date, er.state,
                er.coins as idcoin, co.code AS coin,
                er.idexchangehouse, eh.name AS exchangehouse`)
            .innerJoin('coin', 'co', `co.id = er.coins`)
            .leftJoin('exchange_house', 'eh', `eh.id = er.idexchangehouse`)
            .where(`er.state = 1`)
            .orderBy('er.id', 'DESC')
            .getRawMany();

        if (!ExchangeRate) {
            throw new NotFoundException();
        }

        return ExchangeRate;
    }

    async getLastByExchangeHouse(idexchangehouse: number): Promise<ExchangeRate> {
        const item = await this.repository.findOne({
            where: {
                exchangehouse: idexchangehouse,
                state: 1
            }
        });

        if (!item) {
            return null;
        }

        return item;
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
        const last = await this.getLastByExchangeHouse(Number(data.exchangehouse));
        const save = await this.repository.save(data);
        if (save) {
            if (last) {
                await this.changeStatus(last.id, 2);
            }
            return save;
        } else {
            throw new BadRequestException()
        }

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
        const exists = await this.repository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }

        await this.repository.update(id, { state: 0 });
    }

    async changeStatus(id: number, status: number): Promise<ExchangeRate> {
        const item = await this.repository.findOne({ id });

        if (!item) {
            throw new NotFoundException();
        }

        item.state = status;
        item.save();
        return item;

    }
}
