import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLine } from './business-line.entity';
import { BusinessLineRepository } from './business-line.repository';

@Injectable()
export class BusinessLineService {

    constructor(
        @InjectRepository(BusinessLineRepository)
        private readonly _businessLineRepository: BusinessLineRepository
    ){}

    async get(id: number): Promise<BusinessLine>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const bl = await this._businessLineRepository.findOne(id,{where:{state:1}});

        if(!bl){
            throw new NotFoundException();
        }

        return bl;
    }

    async getAll(): Promise<BusinessLine[]>{
        const bls: BusinessLine[] = await this._businessLineRepository.find({where:{state:1}});
        return bls;
    }

    async create(bl: BusinessLine): Promise<BusinessLine>{
        const saveBl: BusinessLine = await this._businessLineRepository.save(bl);
        return saveBl;
    }

    async update(id: number, bl:BusinessLine): Promise<BusinessLine>{
        const existsBl = await this._businessLineRepository.findOne(id);
        if(!existsBl){
            throw new NotFoundException();
        }
        await this._businessLineRepository.update(id,bl);
        const updateBl : BusinessLine = await this._businessLineRepository.findOne(id);
        return updateBl;
    }

    async delete(id: number): Promise<void>{
        const blExists = await this._businessLineRepository.findOne(id);
        if(!blExists){
            throw new NotFoundException();
        }

        await this._businessLineRepository.update(id,{state:0});
    }
}
