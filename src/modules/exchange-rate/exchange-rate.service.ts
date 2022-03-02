import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from './exchange-rate.entity';
import { ExchangeRateRepository } from './exchange-rate.repository';

@Injectable()
export class ExchangeRateService {

    constructor(
        @InjectRepository(ExchangeRateRepository)
        private readonly _ExchangeRateRepository: ExchangeRateRepository
    ){}

    async get(id: number): Promise<ExchangeRate>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const ExchangeRate = await this._ExchangeRateRepository.findOne(id,{where:{state:1}});

        if(!ExchangeRate){
            throw new NotFoundException();
        }

        return ExchangeRate;
    }

    async getAll(): Promise<ExchangeRate[]>{
        const ExchangeRate: ExchangeRate[] = await this._ExchangeRateRepository.find({where:{state:1}});
        return ExchangeRate;
    }

    async create(bl: ExchangeRate): Promise<ExchangeRate>{
        const saveExchangeRate: ExchangeRate = await this._ExchangeRateRepository.save(bl);
        return saveExchangeRate;
    }

    async update(id: number, ExchangeRate:ExchangeRate): Promise<ExchangeRate>{
        const ExchangeRateExists = await this._ExchangeRateRepository.findOne(id);
        if(!ExchangeRateExists){
            throw new NotFoundException();
        }
        await this._ExchangeRateRepository.update(id,ExchangeRate);
        const updateExchangeRate : ExchangeRate = await this._ExchangeRateRepository.findOne(id);
        return updateExchangeRate;
    }

    async delete(id: number): Promise<void>{
        const ExchangeRateExists = await this._ExchangeRateRepository.findOne(id);
        if(!ExchangeRateExists){
            throw new NotFoundException();
        }

        await this._ExchangeRateRepository.update(id,{state:0});
    }
}
