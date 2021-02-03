import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan } from 'typeorm';
import { QuotationDto } from './dto/quotation.dto';
import { Odontograma } from '../odontograma/odontograma.entity';

import { OdontogramaRepository } from '../odontograma/odontograma.repository';
import { QuotationDetail } from './quotation-detail.entity';
import { QuotationDetailRepository } from './quotation-detail.repository';
import { Quotation } from './quotation.entity';
import { QuotationRepository } from './quotation.repository';

@Injectable()
export class QuotationService {

    constructor(
        @InjectRepository(QuotationRepository)
        private readonly _quotationRepository: QuotationRepository,
        @InjectRepository(QuotationDetailRepository)
        private readonly _quotationDetailRepository: QuotationDetailRepository,
        @InjectRepository(OdontogramaRepository)
        private readonly _odontogramaRepository: OdontogramaRepository
    ){}

    async get(id: number): Promise<Quotation>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const quotation = await this._quotationRepository.findOne(id,{where:{state: 1}});

        if(!quotation){
            throw new NotFoundException();
        }

        return quotation;
    }

    async getAll(): Promise<Quotation[]>{
        const quotation: Quotation[] = await this._quotationRepository.find({where:{state:1}});
        return quotation;
    }

    async getDetail(id): Promise<QuotationDetail[]>{
        const quotation:Quotation = await this._quotationRepository.findOne(id,{where:{state:1}});
        const quotationDetail: QuotationDetail[] = await this._quotationDetailRepository.find({where:{state: MoreThan(0),quotation:quotation}});
        return quotationDetail;
    }

    async create(quotation: Quotation): Promise<Quotation>{
        //insert main data
        const saveQuotation: Quotation = await this._quotationRepository.save(quotation);
        //insert detail data
        quotation.detail.forEach(async(det: QuotationDetail) =>{
            const detail = new QuotationDetail;
            detail.quotation = saveQuotation;
            detail.tariff = det.tariff;
            detail.quantity = det.quantity;
            detail.price = det.price;
            detail.discount = det.discount;
            detail.total = det.total;
            await this._quotationDetailRepository.save(detail);
        });
        //Si hay odontograma lo insertamos
        if(quotation.odontograma){
            const odontograma = new Odontograma;
            odontograma.name = quotation.odontograma;
            odontograma.clinichistory = quotation.clinicHistory;
            odontograma.quotation = saveQuotation;
            await this._odontogramaRepository.save(odontograma);
        }
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
