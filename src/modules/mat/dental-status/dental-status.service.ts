import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DentalStatus } from './dental-status.entity';
import { DentalStatusRepository } from './dental-status.repository';

@Injectable()
export class DentalStatusService {

    constructor(
        @InjectRepository(DentalStatusRepository)
        private readonly _dentalStatusRepository: DentalStatusRepository
    ){}

    async get(id: number): Promise<DentalStatus>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const dentalStatus = await this._dentalStatusRepository.findOne(id,{where:{state:1}});

        if(!dentalStatus){
            throw new NotFoundException();
        }

        return dentalStatus;
    }

    async getAll(): Promise<DentalStatus[]>{
        const dentalStatus: DentalStatus[] = await this._dentalStatusRepository.find({where:{state:1}});
        return dentalStatus;
    }

    async create(dentalStatus: DentalStatus): Promise<DentalStatus>{
        const saveDentalStatus: DentalStatus = await this._dentalStatusRepository.save(dentalStatus);
        return saveDentalStatus;
    }

    async update(id: number, dentalStatus:DentalStatus): Promise<DentalStatus>{
        const dentalStatusExists = await this._dentalStatusRepository.findOne(id);
        if(!dentalStatusExists){
            throw new NotFoundException();
        }
        await this._dentalStatusRepository.update(id,dentalStatus);
        const updateDentalStatus : DentalStatus = await this._dentalStatusRepository.findOne(id);
        return updateDentalStatus;
    }

    async delete(id: number): Promise<void>{
        const dentalStatusExists = await this._dentalStatusRepository.findOne(id);
        if(!dentalStatusExists){
            throw new NotFoundException();
        }
        await this._dentalStatusRepository.update(id,{state:0});
    }
}
