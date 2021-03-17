import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Anamnesis } from './anamnesis.entity';
import { AnamnesisRepository } from './anamnesis.repository';

@Injectable()
export class AnamnesisService {

    constructor(
        @InjectRepository(AnamnesisRepository)
        private readonly _anamnesisRepository: AnamnesisRepository
    ){}

    /**
     * get by id
     * @param id 
     */
    async get(id: number): Promise<Anamnesis[]>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const anamnesis = await this._anamnesisRepository.find({
            where:{
                state:1,
                id
            }
        });

        if(!anamnesis){
            throw new NotFoundException();
        }
        return anamnesis;
    }

    async getAll(): Promise<Anamnesis[]>{
        const anamnesis: Anamnesis[] = await this._anamnesisRepository.find({where:{state:1}});
        return anamnesis;
    }

    async create(anamnesis: Anamnesis): Promise<Anamnesis>{
        const save: Anamnesis = await this._anamnesisRepository.save(anamnesis);
        return save;
    }

    async update(id: number, anamnesis:Anamnesis): Promise<Anamnesis>{
        const exists = await this._anamnesisRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._anamnesisRepository.update(id,anamnesis);
        const update : Anamnesis = await this._anamnesisRepository.findOne(id);
        return update;
    }

    async delete(id: number): Promise<void>{
        const exists = await this._anamnesisRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._anamnesisRepository.update(id,{state:0});
    }

    /**
     * get by idclinichistory
     * @param idclinichistory
     */
     async getByCH(id: number): Promise<Anamnesis>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const anamnesis = await this._anamnesisRepository.findOne({
            where:{
                state:1,
                clinichistory: id
            }
        });

        if(!anamnesis){
            throw new NotFoundException();
        }
        return anamnesis;
    }
}
