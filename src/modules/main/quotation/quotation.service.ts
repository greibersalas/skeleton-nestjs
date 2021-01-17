import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quotation } from './quotation.entity';
import { QuotationRepository } from './quotation.repository';

@Injectable()
export class QuotationService {

    constructor(
        @InjectRepository(QuotationRepository)
        private readonly _quotationRepository: QuotationRepository
    ){}

    async get(id: number): Promise<Quotation>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const quotation = await this._quotationRepository.findOne(id,{where:{state:1}});

        if(!quotation){
            throw new NotFoundException();
        }

        return quotation;
    }

    async getAll(): Promise<Quotation[]>{
        const quotation: Quotation[] = await this._quotationRepository.find({where:{state:1}});
        return quotation;
    }

    async create(quotation: Quotation): Promise<Quotation>{
        const saveQuotation: Quotation = await this._quotationRepository.save(quotation);
        return saveQuotation;
    }

    async update(id: number, quotation:Quotation): Promise<Quotation>{
        const quotationExists = await this._quotationRepository.findOne(id);
        if(!quotationExists){
            throw new NotFoundException();
        }
        await this._quotationRepository.update(id,quotation);
        const updateQuotation : Quotation = await this._quotationRepository.findOne(id);
        return updateQuotation;
    }

    async delete(id: number): Promise<void>{
        const quotationExists = await this._quotationRepository.findOne(id);
        if(!quotationExists){
            throw new NotFoundException();
        }

        await this._quotationRepository.update(id,{state:0});
    }
}
