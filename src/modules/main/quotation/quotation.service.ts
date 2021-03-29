import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        const quotation: Quotation[] = await this._quotationRepository
        .find({
            where: {
                state: 1
            },
            order: {
                id: 'DESC'
            }
        });
        await Promise.all(quotation.map(async (it: any) => {
            let detail = await this._quotationDetailRepository.createQueryBuilder('dt')
            .select('dt.*, bl.name AS businessline')
            .innerJoin('dt.tariff','tr')
            .innerJoin('tr.specialty','sp')
            .innerJoin('sp.businessLines','bl')
            .where('dt.quotation = :id AND dt.state <> 0',{id:it.id})
            .getRawMany();
            it.detail = detail;
        }));
        return quotation;
    }

    async getDetail(id: number): Promise<QuotationDetail[]>{
        return this._quotationDetailRepository
        .createQueryBuilder("qd")
        .innerJoinAndSelect("qd.tariff","tr")
        .innerJoinAndSelect("qd.coin","co")
        .where("qd.quotation = :id AND qd.state <> 0",{id})
        .getMany();
    }

    async create(quotation: any): Promise<Quotation>{
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
            detail.coin = det.coin;
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

    async update(id: number, quotation:any): Promise<Quotation>{
        const quotationExists = await this._quotationRepository.findOne(id);
        if(!quotationExists){
            throw new NotFoundException();
        }
        await this._quotationRepository.update(id,quotation);
        const updateQuotation : Quotation = await this._quotationRepository.findOne(id);
        return updateQuotation;
    }

    async reserveDetail(id: number): Promise<QuotationDetail>{
        const quotationExists = await this._quotationDetailRepository.findOne(id);
        if(!quotationExists){
            throw new NotFoundException();
        }
        quotationExists.state = 3
        await this._quotationDetailRepository.update(id,quotationExists);
        const updateQuotation : QuotationDetail = await this._quotationDetailRepository.findOne(id);
        return updateQuotation;
    }

    async delete(id: number): Promise<void>{
        const quotationExists = await this._quotationRepository.findOne(id);
        if(!quotationExists){
            throw new NotFoundException();
        }

        await this._quotationRepository.update(id,{state:0});
    }

    async getLabPending(): Promise<any[]>{
        const labOrdes: any = await this._quotationDetailRepository
        .createQueryBuilder("qd")
        .innerJoinAndSelect("qd.tariff","tr")
        .innerJoin("tr.specialty","sp","sp.laboratory = :checkLab",{checkLab: true})
        .innerJoinAndSelect("qd.quotation","qt","qt.state <> 0")
        .innerJoinAndSelect("qt.clinicHistory","ch")
        .where("qd.state <> 0")
        .getMany();
        return labOrdes;
    }

    async getByClinicHistory(clinichistory: number): Promise<any[]>{
        const data: any = await this._quotationRepository
        .createQueryBuilder("qt")
        .innerJoinAndSelect("qt.clinicHistory","ch","ch.id = :ch",{ch: clinichistory})
        .where({
            state: 1
        }).getMany();
        await Promise.all(data.map(async (it: any) => {
            let detail = await this._quotationDetailRepository.createQueryBuilder('dt')
            .select('dt.*, bl.name AS businessline')
            .innerJoin('dt.tariff','tr')
            .innerJoin('tr.specialty','sp')
            .innerJoin('sp.businessLines','bl')
            .where('dt.quotation = :id AND dt.state <> 0',{id:it.id})
            .getRawMany();
            it.detail = detail;
        }));
        return data;
    }

    async addItem(item: QuotationDetail): Promise<QuotationDetail>{
        const save = await this._quotationDetailRepository.save(item);
        return save;
    }

    async deleteItem(id: number): Promise<void>{
        const exists = await this._quotationDetailRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._quotationDetailRepository.update(id,{state:0});
    }

    async updateItem(id: number, item: QuotationDetail): Promise<any>{
        const exists = await this._quotationDetailRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        return await this._quotationDetailRepository
        .createQueryBuilder().update(QuotationDetail)
        .set({
            price: item.price,
            quantity: item.quantity,
            discount: item.discount,
            total: item.total
        }).execute();
    }

    async dataPdf(id: number): Promise<any>{
        const exists = await this._quotationRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        const qt: any = await this._quotationRepository
        .createQueryBuilder('qt')
        .innerJoinAndSelect('qt.clinicHistory','ch')
        .innerJoinAndSelect('qt.doctor','dc')
        .where({id}).getOne();

        const dt = await this._quotationDetailRepository.createQueryBuilder('qd')
        .innerJoinAndSelect('qd.coin','co').where({quotation:qt.id}).getMany();
        qt.detail = dt;

        return qt;
    }
}
