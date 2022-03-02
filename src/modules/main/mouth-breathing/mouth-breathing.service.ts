import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MouthBreathing } from './mouth-breathing.entity';
import { MouthBreathingRepository } from './mouth-breathing.repository';

@Injectable()
export class MouthBreathingService {

    constructor(@InjectRepository(MouthBreathingRepository) private readonly _mouthBreathingRepository:MouthBreathingRepository){}

    async get(id: number): Promise<MouthBreathing>{
        if(!id){
            throw new BadRequestException('id must be send');
        }
        const mouthBreathing = await this._mouthBreathingRepository.findOne(id,{where:{state:1}});
        if(!mouthBreathing){
            throw new NotFoundException();
        }
        return mouthBreathing;
    }

    async getAll(): Promise<MouthBreathing[]>{
        const mouthBreathings: MouthBreathing[] = await this._mouthBreathingRepository.find({where:{state:1}});
        return mouthBreathings;
    }

    async create(mouthBreathing: MouthBreathing): Promise<MouthBreathing>{
        const save: MouthBreathing = await this._mouthBreathingRepository.save(mouthBreathing);
        return save;
    }

    async update(id: number, mouthBreathing: MouthBreathing): Promise<void>{
        await this._mouthBreathingRepository.update(id,mouthBreathing);
    }

    async delete(id: number): Promise<void>{
        const mouthBreathingExists = await this._mouthBreathingRepository.findOne(id,{where:{state:1}});
        if(!mouthBreathingExists){
            throw new NotFoundException();
        }
        await this._mouthBreathingRepository.update(id,{state:0});
    }

    async getByClinicHistory(id: number): Promise<MouthBreathing>{
        if(!id){
            throw new BadRequestException('id must be send');
        }
        const mouthBreathing = await this._mouthBreathingRepository
        .createQueryBuilder('mb')
        .where({state:1,clinichistory: id}).getOne();
        if(!mouthBreathing){
            throw new NotFoundException();
        }
        return mouthBreathing;
    }
}
