import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TariffHistory } from './tariff-history.entity';
import { TariffHistoryRepository } from './tariff-history.repository';
import { Tariff } from './tariff.entity';
import { TariffRepository } from './tariff.repository';

@Injectable()
export class TariffService {

    constructor(
        @InjectRepository(TariffRepository)
        private readonly _tariffRepository: TariffRepository,
        @InjectRepository(TariffHistoryRepository)
        private readonly _tariffHistoryRepository: TariffHistoryRepository
    ){}

    async get(id: number): Promise<Tariff>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const tariff = await this._tariffRepository.findOne(id,{where:{state:1}});
        if(!tariff){
            throw new NotFoundException();
        }

        return tariff;
    }

    async getAll(): Promise<Tariff[]>{
        const tariff: Tariff[] = await this._tariffRepository.find({where:{state:1}});
        return tariff;
    }

    async create(tariff: Tariff): Promise<Tariff>{
        const saveTariff: Tariff = await this._tariffRepository.save(tariff);
        //INSERT HISTORY OF PRICE
        const history = new TariffHistory()
        history.price_sol_old = 0;
        history.price_usd_old = 0;
        history.price_sol_new = saveTariff.price_sol;
        history.price_usd_new = saveTariff.price_usd;
        history.tariff = saveTariff;
        await this._tariffHistoryRepository.save(history);
        return saveTariff;
    }

    async update(id: number, tariff:Tariff): Promise<Tariff>{
        const tariffExists = await this._tariffRepository.findOne(id);
        if(!tariffExists){
            throw new NotFoundException();
        }
        await this._tariffRepository.update(id,tariff);
        const updateTariff : Tariff = await this._tariffRepository.findOne(id);
        
        return updateTariff;
    }

    async delete(id: number): Promise<void>{
        const tariffExists = await this._tariffRepository.findOne(id);
        if(!tariffExists){
            throw new NotFoundException();
        }
        await this._tariffRepository.update(id,{state:0});
    }

    async addHistory(tariffHistory: TariffHistory): Promise<void>{
        await this._tariffHistoryRepository.save(tariffHistory);
    }
}
