import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deparments } from './deparments.entity';
import { DeparmentsRepository } from './deparments.repository';

@Injectable()
export class DeparmentsService {

    constructor(
        @InjectRepository(DeparmentsRepository)
        private readonly _DeparmentsRepository: DeparmentsRepository
    ){}

    async get(id: number): Promise<Deparments>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const Deparments = await this._DeparmentsRepository.findOne(id,{where:{state:1}});
        if(!Deparments){
            throw new NotFoundException();
        }
        return Deparments;
    }

    async getAll(): Promise<Deparments[]>{
        const Deparments: Deparments[] = await this._DeparmentsRepository.find({
            where: { state: 1 },
            order: { name: 'ASC' }
        });
        return Deparments;
    }

    async create(bl: Deparments): Promise<Deparments>{
        const saveDeparments: Deparments = await this._DeparmentsRepository.save(bl);
        return saveDeparments;
    }

    async update(id: number, Deparments:Deparments): Promise<Deparments>{
        const DeparmentsExists = await this._DeparmentsRepository.findOne(id);
        if(!DeparmentsExists){
            throw new NotFoundException();
        }
        await this._DeparmentsRepository.update(id,Deparments);
        const updateDeparments : Deparments = await this._DeparmentsRepository.findOne(id);
        return updateDeparments;
    }

    async delete(id: number): Promise<void>{
        const DeparmentsExists = await this._DeparmentsRepository.findOne(id);
        if(!DeparmentsExists){
            throw new NotFoundException();
        }

        await this._DeparmentsRepository.update(id,{state:0});
    }
}
