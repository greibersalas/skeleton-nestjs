import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LabProgramming } from './lab-programming.entity';
import { LabProgrammingRepository } from './lab-programming.repository';

@Injectable()
export class LabProgrammingService {

    constructor(
        @InjectRepository(LabProgrammingRepository)
        private readonly _labProgrammingRepository: LabProgrammingRepository
    ){}

    async get(id: number): Promise<LabProgramming>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const labProgramming = await this._labProgrammingRepository.findOne(id,{where:{state:1}});

        if(!labProgramming){
            throw new NotFoundException();
        }

        return labProgramming;
    }

    async getAll(): Promise<LabProgramming[]>{
        const labProgramming: LabProgramming[] = await this._labProgrammingRepository.find({where:{state:1}});
        return labProgramming;
    }

    async create(labProgramming: LabProgramming): Promise<LabProgramming>{
        const save: LabProgramming = await this._labProgrammingRepository.save(labProgramming);
        return save;
    }

    async update(id: number, labProgramming:LabProgramming): Promise<LabProgramming>{
        const exists = await this._labProgrammingRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._labProgrammingRepository.update(id,labProgramming);
        const update : LabProgramming = await this._labProgrammingRepository.findOne(id);
        return update;
    }

    async delete(id: number): Promise<void>{
        const exists = await this._labProgrammingRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._labProgrammingRepository.update(id,{state:0});
    }
}
