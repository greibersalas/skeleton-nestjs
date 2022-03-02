import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {AttentionCard } from './attention-card.entity';
import { AttentionCardRepository } from './attention-card.repository';

@Injectable()
export class AttentionCardService {

    constructor(
        @InjectRepository(AttentionCardRepository)
        private readonly _attentionCardRepository: AttentionCardRepository
    ){}

    async get(id: number): Promise<AttentionCard>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const attentionCard = await this._attentionCardRepository.findOne(id,{where:{state:1}});

        if(!attentionCard){
            throw new NotFoundException();
        }

        return attentionCard;
    }

    async getByClinicHistory(id: number): Promise<AttentionCard>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const attentionCard = await this._attentionCardRepository.findOne({where:{state:1,clinichistory:id}});
        if(!attentionCard){
            throw new NotFoundException();
        }

        return attentionCard;
    }

    async getAll(): Promise<AttentionCard[]>{
        const attentionCard: AttentionCard[] = await this._attentionCardRepository.find({where:{state:1}});
        return attentionCard;
    }

    async create(bl: AttentionCard): Promise<AttentionCard>{
        const saveAttentionCard: AttentionCard = await this._attentionCardRepository.save(bl);
        return saveAttentionCard;
    }

    async update(id: number, attentionCard:AttentionCard): Promise<AttentionCard>{
        const attentionCardExists = await this._attentionCardRepository.findOne(id);
        if(!attentionCardExists){
            throw new NotFoundException();
        }
        await this._attentionCardRepository.update(id,attentionCard);
        const updateAttentionCard : AttentionCard = await this._attentionCardRepository.findOne(id);
        return updateAttentionCard;
    }

    async delete(id: number): Promise<void>{
        const attentionCardExists = await this._attentionCardRepository.findOne(id);
        if(!attentionCardExists){
            throw new NotFoundException();
        }

        await this._attentionCardRepository.update(id,{state:0});
    }

    async getPdfData(id: number): Promise<AttentionCard>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const attentionCard = await this._attentionCardRepository.createQueryBuilder('ac')
        .innerJoinAndSelect("ac.clinichistory","ch")
        .where("ac.id = :id",{id}).getOne();

        if(!attentionCard){
            throw new NotFoundException();
        }

        return attentionCard;
    }
}
