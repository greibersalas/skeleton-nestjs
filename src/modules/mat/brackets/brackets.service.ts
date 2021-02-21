import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Brackets } from './brackets.entity';
import { BracketsRepository } from './brackets.repository';

@Injectable()
export class BracketsService {

    constructor(
        @InjectRepository(BracketsRepository)
        private readonly _bracketsRepository: BracketsRepository
    ){}

    async get(id: number): Promise<Brackets>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const brakets = await this._bracketsRepository.findOne(id,{where:{state:1}});

        if(!brakets){
            throw new NotFoundException();
        }

        return brakets;
    }

    async getAll(): Promise<Brackets[]>{
        const brakets: Brackets[] = await this._bracketsRepository.find({where:{state:1}});
        return brakets;
    }

    async create(brakets: Brackets): Promise<Brackets>{
        const saveBrackets: Brackets = await this._bracketsRepository.save(brakets);
        return saveBrackets;
    }

    async update(id: number, brakets:Brackets): Promise<Brackets>{
        const bracketsExists = await this._bracketsRepository.findOne(id);
        if(!bracketsExists){
            throw new NotFoundException();
        }
        await this._bracketsRepository.update(id,brakets);
        const updateBrackets : Brackets = await this._bracketsRepository.findOne(id);
        return updateBrackets;
    }

    async delete(id: number): Promise<void>{
        const braketsExists = await this._bracketsRepository.findOne(id);
        if(!braketsExists){
            throw new NotFoundException();
        }
        await this._bracketsRepository.update(id,{state:0});
    }
}
