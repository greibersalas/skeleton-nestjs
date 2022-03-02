import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LabeledStatus } from './labeled-status.entity';
import { LabeledStatusRepository } from './labeled-status.repository';

@Injectable()
export class LabeledStatusService {

    constructor(
        @InjectRepository(LabeledStatusRepository)
        private readonly _labeledStatusRepository: LabeledStatusRepository
    ){}

    async get(id: number): Promise<LabeledStatus>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const labeledStatus = await this._labeledStatusRepository.findOne(id,{where:{state:1}});

        if(!labeledStatus){
            throw new NotFoundException();
        }

        return labeledStatus;
    }

    async getAll(): Promise<LabeledStatus[]>{
        const labeledStatus: LabeledStatus[] = await this._labeledStatusRepository.find({where:{state:1}});
        return labeledStatus;
    }

    async create(labeledStatus: LabeledStatus): Promise<LabeledStatus>{
        const save: LabeledStatus = await this._labeledStatusRepository.save(labeledStatus);
        return save;
    }

    async update(id: number, labeledStatus:LabeledStatus): Promise<LabeledStatus>{
        const exists = await this._labeledStatusRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._labeledStatusRepository.update(id,labeledStatus);
        const update : LabeledStatus = await this._labeledStatusRepository.findOne(id);
        return update;
    }

    async delete(id: number): Promise<void>{
        const exists = await this._labeledStatusRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._labeledStatusRepository.update(id,{state:0});
    }
}
