import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LabOrderLabeled } from './lab-order-labeled.entity';
import { LabOrderLabeledRepository } from './lab-order-labeled.repository';

@Injectable()
export class LabOrderLabeledService {

    constructor(
        @InjectRepository(LabOrderLabeledRepository)
        private readonly _labOrderLabeledRepository: LabOrderLabeledRepository
    ){}

    /**
     * get by laborder
     * @param id 
     */
    async get(id: number): Promise<LabOrderLabeled[]>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const labOrderLabeled = await this._labOrderLabeledRepository.find({
            where:{
                state:1,
                laborder: id
            }
        });

        if(!labOrderLabeled){
            throw new NotFoundException();
        }
        return labOrderLabeled;
    }

    async getAll(): Promise<LabOrderLabeled[]>{
        const labOrderLabeled: LabOrderLabeled[] = await this._labOrderLabeledRepository.find({where:{state:1}});
        return labOrderLabeled;
    }

    async create(labOrderLabeled: LabOrderLabeled): Promise<LabOrderLabeled>{
        const save: LabOrderLabeled = await this._labOrderLabeledRepository.save(labOrderLabeled);
        return save;
    }

    async update(id: number, labOrderLabeled:LabOrderLabeled): Promise<LabOrderLabeled>{
        const exists = await this._labOrderLabeledRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._labOrderLabeledRepository.update(id,labOrderLabeled);
        const update : LabOrderLabeled = await this._labOrderLabeledRepository.findOne(id);
        return update;
    }

    async delete(id: number): Promise<void>{
        const exists = await this._labOrderLabeledRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._labOrderLabeledRepository.update(id,{state:0});
    }
}
