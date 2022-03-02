import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from './coin.entity';
import { CoinRepository } from './coin.repository';

@Injectable()
export class CoinService {

    constructor(
        @InjectRepository(CoinRepository)
        private readonly _CoinRepository: CoinRepository
    ){}

    async get(id: number): Promise<Coin>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const Coin = await this._CoinRepository.findOne(id,{where:{state:1}});

        if(!Coin){
            throw new NotFoundException();
        }

        return Coin;
    }

    async getAll(): Promise<Coin[]>{
        const Coin: Coin[] = await this._CoinRepository.find({where:{state:1}});
        return Coin;
    }

    async create(bl: Coin): Promise<Coin>{
        const saveCoin: Coin = await this._CoinRepository.save(bl);
        return saveCoin;
    }

    async update(id: number, Coin:Coin): Promise<Coin>{
        const CoinExists = await this._CoinRepository.findOne(id);
        if(!CoinExists){
            throw new NotFoundException();
        }
        await this._CoinRepository.update(id,Coin);
        const updateCoin : Coin = await this._CoinRepository.findOne(id);
        return updateCoin;
    }

    async delete(id: number): Promise<void>{
        const CoinExists = await this._CoinRepository.findOne(id);
        if(!CoinExists){
            throw new NotFoundException();
        }

        await this._CoinRepository.update(id,{state:0});
    }
}

