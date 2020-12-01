import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsuranceCarrier } from './insurance-carrier.entity';
import { InsuranceCarrierRepository } from './insurance-carrier.repository';

@Injectable()
export class InsuranceCarrierService {

    constructor(
        @InjectRepository(InsuranceCarrierRepository)
        private readonly _icRepository: InsuranceCarrierRepository
    ){}

    async get(id: number): Promise<InsuranceCarrier>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const ic = await this._icRepository.findOne(id,{where:{state:1}});

        if(!ic){
            throw new NotFoundException();
        }

        return ic;
    }

    async getAll(): Promise<InsuranceCarrier[]>{
        const ics: InsuranceCarrier[] = await this._icRepository.find({where:{state:1}});
        return ics;
    }

    async create(ic: InsuranceCarrier): Promise<InsuranceCarrier>{
        const saveIc: InsuranceCarrier = await this._icRepository.save(ic);
        return saveIc;
    }

    async update(id: number, ic:InsuranceCarrier): Promise<InsuranceCarrier>{
        const existsIc = await this._icRepository.findOne(id);
        if(!existsIc){
            throw new NotFoundException();
        }
        await this._icRepository.update(id,ic);
        const updateIc : InsuranceCarrier = await this._icRepository.findOne(id);
        return updateIc;
    }

    async delete(id: number): Promise<void>{
        const icExists = await this._icRepository.findOne(id);
        if(!icExists){
            throw new NotFoundException();
        }

        await this._icRepository.update(id,{state:0});
    }
}
