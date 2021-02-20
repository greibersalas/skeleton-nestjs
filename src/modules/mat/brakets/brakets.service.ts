import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Brakets } from './brakets.entity';
import { BraketsRepository } from './brakets.repository';

@Injectable()
export class BraketsService {

    constructor(
        @InjectRepository(BraketsRepository)
        private readonly _braketsRepository: BraketsRepository
    ){}

    async get(id: number): Promise<Brakets>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const brakets = await this._braketsRepository.findOne(id,{where:{state:1}});

        if(!brakets){
            throw new NotFoundException();
        }

        return brakets;
    }

    async getAll(): Promise<Brakets[]>{
        const brakets: Brakets[] = await this._braketsRepository.find({where:{state:1}});
        return brakets;
    }

    async create(brakets: Brakets): Promise<Brakets>{
        const saveBrakets: Brakets = await this._braketsRepository.save(brakets);
        return saveBrakets;
    }

    async update(id: number, brakets:Brakets): Promise<Brakets>{
        const braketsExists = await this._braketsRepository.findOne(id);
        if(!braketsExists){
            throw new NotFoundException();
        }
        await this._braketsRepository.update(id,brakets);
        const updateBrakets : Brakets = await this._braketsRepository.findOne(id);
        return updateBrakets;
    }

    async delete(id: number): Promise<void>{
        const braketsExists = await this._braketsRepository.findOne(id);
        if(!braketsExists){
            throw new NotFoundException();
        }
        await this._braketsRepository.update(id,{state:0});
    }
}
