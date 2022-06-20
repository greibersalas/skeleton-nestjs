import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LabState } from './lab-state.entity';
import { LabStateRepository } from './lab-state.repository';

@Injectable()
export class LabStateService {
    constructor(
        @InjectRepository(LabStateRepository)
        private readonly labStateRepository: LabStateRepository
    ){}

    async get(id: number): Promise<LabState>{
        if (!id){
            throw new BadRequestException('id must be send.');
        }
        const labState = await this.labStateRepository.findOne(id, {where: {state: 1}});
        if (!labState){
            throw new NotFoundException();
        }
        return labState;
    }

    async getAll(): Promise<LabState[]>{
        const labState: LabState[] = await this.labStateRepository.find({
            where: {state: 1},
            order: {name: 'ASC'}
        });
        return labState;
    }

    async create(labState: LabState): Promise<LabState>{
        const savelabState: LabState = await this.labStateRepository.save(labState);
        return savelabState;
    }

    async update(id: number, labState: LabState): Promise<LabState>{
        const labStateExists = await this.labStateRepository.findOne(id);
        if(!labStateExists){
            throw new NotFoundException();
        }
        await this.labStateRepository.update(id, labState);
        const updatelabState : LabState = await this.labStateRepository.findOne(id);
        return updatelabState;
    }

    async delete(id: number): Promise<void>{
        const labStateExists = await this.labStateRepository.findOne(id);
        if(!labStateExists){
            throw new NotFoundException();
        }
        await this.labStateRepository.update(id, {state: 0});
    }
}
