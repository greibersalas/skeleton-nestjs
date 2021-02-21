import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LabOrder } from './lab-order.entity';
import { LabOrderRepository } from './lab-order.repository';

@Injectable()
export class LabOrderService {

    constructor(
        @InjectRepository(LabOrderRepository)
        private readonly _labOrderRepository: LabOrderRepository
    ){}

    async get(id: number): Promise<LabOrder>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        //const labOrder = await this._labOrderRepository.findOne(id,{where:{state:1}});
        const labOrder: LabOrder = await this._labOrderRepository
        .createQueryBuilder("lo")
        .innerJoinAndSelect("lo.quotation_detail","qd")
        .innerJoinAndSelect("lo.doctor","dr")
        .innerJoinAndSelect("lo.bracket","br")
        .getOne();
        if(!labOrder){
            throw new NotFoundException();
        }
        return labOrder;
    }

    async getAll(): Promise<LabOrder[]>{
        //const labOrder: LabOrder[] = await this._labOrderRepository.find({where:{state:1}});
        const labOrder: LabOrder[] = await this._labOrderRepository
        .createQueryBuilder("lo")
        .innerJoinAndSelect("lo.quotation_detail","qd")
        .innerJoinAndSelect("qd.quotation","qo")
        .innerJoinAndSelect("qo.clinicHistory","patient")
        .innerJoinAndSelect("lo.doctor","dr")
        .innerJoinAndSelect("lo.bracket","br")
        .getMany();
        return labOrder;
    }

    async create(labOrder: LabOrder): Promise<LabOrder>{
        const saveLabOrder: LabOrder = await this._labOrderRepository.save(labOrder);
        return saveLabOrder;
    }

    async update(id: number, labOrder:LabOrder): Promise<LabOrder>{
        const labOrderExists = await this._labOrderRepository.findOne(id);
        if(!labOrderExists){
            throw new NotFoundException();
        }
        await this._labOrderRepository.update(id,labOrder);
        const updateLabOrder : LabOrder = await this._labOrderRepository.findOne(id);
        return updateLabOrder;
    }

    async delete(id: number): Promise<void>{
        const labOrderExists = await this._labOrderRepository.findOne(id);
        if(!labOrderExists){
            throw new NotFoundException();
        }
        await this._labOrderRepository.update(id,{state:0});
    }
}
