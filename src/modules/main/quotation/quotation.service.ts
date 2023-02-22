import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';
import { Odontograma } from '../odontograma/odontograma.entity';

import { OdontogramaRepository } from '../odontograma/odontograma.repository';
import { QuotationTermsRepository } from '../quotation-terms/quotation-terms.repository';
import { QuotationDetailRepository } from './quotation-detail.repository';
import { QuotationDetail } from './quotation-detail.entity';
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
        private readonly _odontogramaRepository: OdontogramaRepository,
        @InjectRepository(QuotationTermsRepository)
        private readonly _quotationTermsRepository: QuotationTermsRepository
    ) { }

    async get(id: number): Promise<Quotation> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }

        const quotation = await this._quotationRepository.findOne(id, { where: { state: 1 } });

        if (!quotation) {
            throw new NotFoundException();
        }

        return quotation;
    }

    async getAll(): Promise<Quotation[]> {
        const quotation: Quotation[] = await this._quotationRepository
            .find({
                where: {
                    state: 1
                },
                order: {
                    id: 'DESC'
                },
                take: 800
            });
        await Promise.all(quotation.map(async (it: any) => {
            let detail = await this._quotationDetailRepository.createQueryBuilder('dt')
                .select('dt.*, bl.name AS businessline')
                .innerJoin('dt.tariff', 'tr')
                .innerJoin('tr.specialty', 'sp')
                .innerJoin('sp.businessLines', 'bl')
                .where('dt.quotation = :id AND dt.state <> 0', { id: it.id })
                .getRawMany();
            it.detail = detail;
        }));
        return quotation;
    }

    async getFilters(filters: any): Promise<any[]> {
        const { since, until, patients } = filters;
        let where = 'qt.date between :since and :until and qt.state <> 0';
        if ((patients.length === 1 && patients[0] !== '0') || patients.length > 1) {
            where += ' and qt.idclinichistory IN(:...patients)';
        }
        const quotation = await this._quotationRepository.createQueryBuilder('qt')
            .select(`qt.id,
        qt.date,
        qt.state,
        concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name) AS patient,
        ch.email,
        ch.birthdate,
        "dc"."nameQuote" AS doctor,
        bl.name AS businessLine,
        sp.name AS specialty,
        sp.format, ch."documentNumber" AS patient_num_doc,
        ch.history`)
            .innerJoin('clinic_history', 'ch', 'ch.id = qt.idclinichistory')
            .innerJoin('doctor', 'dc', 'dc.id = qt.iddoctor')
            .innerJoin('business_line', 'bl', 'bl.id = qt.idbusinessline')
            .innerJoin('specialty', 'sp', 'sp.id = qt.specialty')
            .where(`${where}`, { since, until, patients })
            .orderBy('qt.id', 'DESC')
            .getRawMany();

        return quotation;
    }

    async getDetail(id: number): Promise<QuotationDetail[]> {
        return this._quotationDetailRepository
            .createQueryBuilder("qd")
            .innerJoinAndSelect("qd.tariff", "tr")
            .innerJoinAndSelect("qd.coin", "co")
            .where("qd.quotation = :id AND qd.state <> 0", { id })
            .getMany();
    }

    async create(quotation: any): Promise<Quotation> {
        //insert main data
        const saveQuotation: Quotation = await this._quotationRepository.save(quotation);
        //insert detail data
        quotation.detail.forEach(async (det: QuotationDetail) => {
            const detail = new QuotationDetail;
            detail.quotation = saveQuotation;
            detail.tariff = det.tariff;
            detail.quantity = det.quantity;
            detail.price = det.price;
            detail.discount = det.discount;
            detail.total = det.total;
            detail.coin = det.coin;
            detail.porce_discount = det.porce_discount;
            await this._quotationDetailRepository.save(detail);
        });
        //Si hay odontograma lo insertamos
        if (quotation.odontograma) {
            const odontograma = new Odontograma;
            odontograma.name = quotation.odontograma;
            odontograma.clinichistory = quotation.clinicHistory;
            odontograma.quotation = saveQuotation;
            await this._odontogramaRepository.save(odontograma);
        }
        return saveQuotation;
    }

    async update(id: number, quotation: any): Promise<Quotation> {
        const quotationExists = await this._quotationRepository.findOne(id);
        if (!quotationExists) {
            throw new NotFoundException();
        }
        const data: any = {
            ...quotationExists,
            doctor: quotation.doctor
        }
        await this._quotationRepository.update(id, data);
        const updateQuotation: Quotation = await this._quotationRepository.findOne(id);
        return updateQuotation;
    }

    async reserveDetail(id: number): Promise<QuotationDetail> {
        const quotationExists = await this._quotationDetailRepository.findOne(id);
        if (!quotationExists) {
            throw new NotFoundException();
        }
        quotationExists.state = 3
        await this._quotationDetailRepository.update(id, quotationExists);
        const updateQuotation: QuotationDetail = await this._quotationDetailRepository.findOne(id);
        return updateQuotation;
    }

    async delete(id: number): Promise<void> {
        const quotationExists = await this._quotationRepository.findOne(id);
        if (!quotationExists) {
            throw new NotFoundException();
        }

        await this._quotationRepository.update(id, { state: 0 });
    }

    async getLabPending(): Promise<any[]> {
        const labOrdes: any = await this._quotationDetailRepository
            .createQueryBuilder("qd")
            .innerJoinAndSelect("qd.tariff", "tr")
            .leftJoin("tr.specialty", "sp", "sp.laboratory = :checkLab", { checkLab: true })
            .innerJoinAndSelect("qd.quotation", "qt", "qt.state <> 0")
            .innerJoinAndSelect("qt.clinicHistory", "ch")
            .where("qd.state <> 0")
            .orderBy('qt.id', 'DESC')
            .getMany();
        return labOrdes;
    }

    async getByClinicHistory(clinichistory: number): Promise<any[]> {
        const data: any = await this._quotationRepository
            .createQueryBuilder("qt")
            .innerJoinAndSelect("qt.clinicHistory", "ch", "ch.id = :ch", { ch: clinichistory })
            .where({
                state: 1
            }).getMany();
        await Promise.all(data.map(async (it: any) => {
            let detail = await this._quotationDetailRepository.createQueryBuilder('dt')
                .select('dt.*, bl.name AS businessline')
                .innerJoin('dt.tariff', 'tr')
                .innerJoin('tr.specialty', 'sp')
                .innerJoin('sp.businessLines', 'bl')
                .where('dt.quotation = :id AND dt.state <> 0', { id: it.id })
                .getRawMany();
            it.detail = detail;
        }));
        return data;
    }

    async getByPatient(idclinichistory: number): Promise<any> {
        return await this._quotationRepository.createQueryBuilder('q')
            .select(`id, concat('Nro. ',id,' - ','Fecha: ',date) AS description`)
            .where(`q.idclinichistory = ${idclinichistory}`)
            .andWhere('q.state <> 0')
            .orderBy('q.id', 'DESC')
            .getRawMany();
    }

    async addItem(item: QuotationDetail): Promise<QuotationDetail> {
        const save = await this._quotationDetailRepository.save(item);
        return save;
    }

    async deleteItem(id: number): Promise<void> {
        const exists = await this._quotationDetailRepository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this._quotationDetailRepository.update(id, { state: 0 });
    }

    async updateItem(id: number, item: QuotationDetail): Promise<any> {
        const exists = await this._quotationDetailRepository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        return await this._quotationDetailRepository
            .createQueryBuilder().update(QuotationDetail)
            .set({
                price: item.price,
                quantity: item.quantity,
                porce_discount: item.porce_discount,
                discount: item.discount,
                total: item.total
            }).where({ id }).execute();
    }

    async dataPdf(id: number): Promise<any> {
        const exists = await this._quotationRepository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        //Datos de la cotización
        const qt: any = await this._quotationRepository
            .createQueryBuilder('qt')
            .innerJoinAndSelect('qt.clinicHistory', 'ch')
            .innerJoinAndSelect('qt.doctor', 'dc')
            .where({ id }).getOne();

        //Detalle de la cotización
        const dt = await this._quotationDetailRepository.createQueryBuilder('qd')
            .innerJoinAndSelect('qd.coin', 'co')
            .innerJoinAndSelect('qd.tariff', 'tr')
            .where("qd.quotation = :idquotation AND qd.state <> 0", { idquotation: qt.id }).getMany();
        qt.detail = dt;

        //Terminos de la cotización
        const terms = await this._quotationTermsRepository
            .createQueryBuilder('qt')
            .where({ quotation: qt.id, state: 1 }).orderBy({ description: 'ASC' }).getMany();
        qt.terms = terms;

        // Buscamos si la cotización tiene odontograma
        const odonto = await this._quotationRepository.createQueryBuilder('qt')
            .select(`og.*`)
            .innerJoin('odontograma', 'og', 'og.quotation = qt.id AND og.state = 1')
            .where({ id })
            .getRawOne();
        qt.odontograma = odonto;
        return qt;
    }
}
