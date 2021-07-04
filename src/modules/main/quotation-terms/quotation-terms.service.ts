import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QuotationTerms } from './quotation-terms.entity';
import { QuotationTermsRepository } from './quotation-terms.repository';

@Injectable()
export class QuotationTermsService {

    constructor(@InjectRepository(QuotationTermsRepository) private readonly _quotationTermsRepository:QuotationTermsRepository){}

    async get(id: number): Promise<QuotationTerms>{
        if(!id){
            throw new BadRequestException('id must be send');
        }
        const quotationTerms = await this._quotationTermsRepository.findOne(id,{where:{state:1}});
        if(!quotationTerms){
            throw new NotFoundException();
        }
        return quotationTerms;
    }

    async getAll(): Promise<QuotationTerms[]>{
        const quotationTermss: QuotationTerms[] = await this._quotationTermsRepository.find({where:{state:1}});
        return quotationTermss;
    }

    async create(quotationTerms: QuotationTerms): Promise<QuotationTerms>{
        const save: QuotationTerms = await this._quotationTermsRepository.save(quotationTerms);
        return save;
    }

    async createMany(quotationTerms: any): Promise<boolean>{
        let data = quotationTerms.data;
        data.forEach( async (it: QuotationTerms) =>{
            if(it.id === 0){
                if(!this._quotationTermsRepository.save(it)){
                    return false;
                }
            }else{
                this._quotationTermsRepository.update(it.id,it);
            }
        });
        return true;
    }

    async update(id: number, quotationTerms: QuotationTerms): Promise<void>{
        await this._quotationTermsRepository.update(id,quotationTerms);
    }

    async delete(id: number): Promise<void>{
        const quotationTermsExists = await this._quotationTermsRepository.findOne(id,{where:{state:1}});
        if(!quotationTermsExists){
            throw new NotFoundException();
        }
        await this._quotationTermsRepository.update(id,{state:0});
    }

    async getByQuotation(id: number): Promise<QuotationTerms[]>{
        if(!id){
            throw new BadRequestException('id must be send');
        }
        const quotationTerms = await this._quotationTermsRepository
        .createQueryBuilder('mb')
        .where({state:1,quotation: id}).getMany();
        if(!quotationTerms){
            throw new NotFoundException();
        }
        return quotationTerms;
    }
}
