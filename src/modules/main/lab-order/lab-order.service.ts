import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LabOrder } from './lab-order.entity';
import { LabOrderRepository } from './lab-order.repository';
import { QuotationDetailRepository } from '../quotation/quotation-detail.repository';
import { QuotationDetail } from '../quotation/quotation-detail.entity';

@Injectable()
export class LabOrderService {

    constructor(
        @InjectRepository(LabOrderRepository)
        private readonly _labOrderRepository: LabOrderRepository,
        @InjectRepository(QuotationDetailRepository)
        private readonly _qdRepository: QuotationDetailRepository
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
        .innerJoinAndSelect("lo.tariff","tr")
        .where("lo.id = :id",{id})
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
        .innerJoinAndSelect("lo.tariff","tr")
        .getMany();
        return labOrder;
    }

    async create(labOrder: LabOrder): Promise<LabOrder>{
        const save: LabOrder = await this._labOrderRepository.save(labOrder);
        //cambiamos el estado del detalle de la cotización
        if(save){
            await this._qdRepository.createQueryBuilder()
            .update(QuotationDetail)
            .update({state: 3}).where({id: labOrder.quotation_detail})
            .execute();
        }
        return save;
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

    async getCant(date: Date, job: string): Promise<number>{
        const cant = await this._labOrderRepository.createQueryBuilder()
        //.select('count(id) as total')
        .where('job = :job AND date = :date AND state = 1',{
            job,date
        }).getCount();
        return cant;
    }

    async getProduction(filters: any): Promise<any>{
        if(filters.option === 'i'){
            if(filters.state === '0'){
                const production = await this._labOrderRepository.createQueryBuilder()
                .select(`job,
                    CASE
                        WHEN job = 'Nuevo' THEN COUNT(job)
                        WHEN job = 'Nuevo Adicional' THEN count(job)
                        WHEN job = 'Colocar Chip' then count(job)
                        WHEN job = 'Modificación' THEN COUNT(job)
                        WHEN job = 'Reparación' THEN count(job)
                        WHEN job = 'Desiste' then count(job)
                    ELSE 0 END as total`)
                .where(`instalation::DATE BETWEEN :since AND :until AND state <> 0`,{
                    since: filters.since,until: filters.until
                }).groupBy("job").orderBy({job:'ASC'}).getRawMany();
                return production;
            }else{
                const production = await this._labOrderRepository.createQueryBuilder()
                .select(`job,
                    CASE
                        WHEN job = 'Nuevo' THEN COUNT(job)
                        WHEN job = 'Nuevo Adicional' THEN count(job)
                        WHEN job = 'Colocar Chip' then count(job)
                        WHEN job = 'Modificación' THEN COUNT(job)
                        WHEN job = 'Reparación' THEN count(job)
                        WHEN job = 'Desiste' then count(job)
                    ELSE 0 END as total`)
                .where(`instalation::DATE BETWEEN :since AND :until AND state <> 0
                AND job = :job`,{
                    since: filters.since,until: filters.until, job: filters.state
                }).groupBy("job").orderBy({job:'ASC'}).getRawMany();
                return production;
            }
        }else if(filters.option === 'e'){
            if(filters.state === '0'){
                const production = await this._labOrderRepository.createQueryBuilder()
                .select(`job,
                    CASE
                        WHEN job = 'Nuevo' THEN COUNT(job)
                        WHEN job = 'Nuevo Adicional' THEN count(job)
                        WHEN job = 'Colocar Chip' then count(job)
                        WHEN job = 'Modificación' THEN COUNT(job)
                        WHEN job = 'Reparación' THEN count(job)
                        WHEN job = 'Desiste' then count(job)
                    ELSE 0 END as total`)
                .where(`elaboration::DATE BETWEEN :since AND :until AND state <> 0`,{
                    since: filters.since,until: filters.until
                }).groupBy("job").orderBy({job:'ASC'}).getRawMany();
                return production;
            }else{
                const production = await this._labOrderRepository.createQueryBuilder()
                .select(`job,
                    CASE
                        WHEN job = 'Nuevo' THEN COUNT(job)
                        WHEN job = 'Nuevo Adicional' THEN count(job)
                        WHEN job = 'Colocar Chip' then count(job)
                        WHEN job = 'Modificación' THEN COUNT(job)
                        WHEN job = 'Reparación' THEN count(job)
                        WHEN job = 'Desiste' then count(job)
                    ELSE 0 END as total`)
                .where(`elaboration::DATE BETWEEN :since AND :until AND state <> 0
                AND job = :job`,{
                    since: filters.since,until: filters.until,job: filters.state
                }).groupBy("job").orderBy({job:'ASC'}).getRawMany();
                return production;
            }
        }
    }

    async getAllFilter(filters: any): Promise<LabOrder[]>{
        if(filters.option === 'i'){
            if(filters.state === '0'){
                const labOrder: LabOrder[] = await this._labOrderRepository
                .createQueryBuilder("lo")
                .innerJoinAndSelect("lo.quotation_detail","qd")
                .innerJoinAndSelect("qd.quotation","qo")
                .innerJoinAndSelect("qo.clinicHistory","patient")
                .innerJoinAndSelect("lo.doctor","dr")
                .innerJoinAndSelect("lo.tariff","tr")
                .where(`lo.instalation::DATE BETWEEN :since AND :until AND lo.state <> 0`,{
                    since: filters.since,until: filters.until
                })
                .getMany();
                return labOrder;
            }else{
                const labOrder: LabOrder[] = await this._labOrderRepository
                .createQueryBuilder("lo")
                .innerJoinAndSelect("lo.quotation_detail","qd")
                .innerJoinAndSelect("qd.quotation","qo")
                .innerJoinAndSelect("qo.clinicHistory","patient")
                .innerJoinAndSelect("lo.doctor","dr")
                .innerJoinAndSelect("lo.tariff","tr")
                .where(`lo.instalation::DATE BETWEEN :since AND :until AND lo.state <> 0
                AND lo.job = :job`,{
                    since: filters.since,
                    until: filters.until,
                    job: filters.state
                })
                .getMany();
                return labOrder;
            }

        }else if(filters.option === 'e'){
            if(filters.state === '0'){
                const labOrder: LabOrder[] = await this._labOrderRepository
                .createQueryBuilder("lo")
                .innerJoinAndSelect("lo.quotation_detail","qd")
                .innerJoinAndSelect("qd.quotation","qo")
                .innerJoinAndSelect("qo.clinicHistory","patient")
                .innerJoinAndSelect("lo.doctor","dr")
                .innerJoinAndSelect("lo.tariff","tr")
                .where(`lo.elaboration::DATE BETWEEN :since AND :until AND lo.state <> 0`,{
                    since: filters.since,until: filters.until
                })
                .getMany();
                return labOrder;
            }else{
                const labOrder: LabOrder[] = await this._labOrderRepository
                .createQueryBuilder("lo")
                .innerJoinAndSelect("lo.quotation_detail","qd")
                .innerJoinAndSelect("qd.quotation","qo")
                .innerJoinAndSelect("qo.clinicHistory","patient")
                .innerJoinAndSelect("lo.doctor","dr")
                .innerJoinAndSelect("lo.tariff","tr")
                .where(`lo.elaboration::DATE BETWEEN :since AND :until AND lo.state <> 0
                AND lo.job = :job`,{
                    since: filters.since,
                    until: filters.until,
                    job: filters.state
                })
                .getMany();
                return labOrder;
            }
        }
    }

    async confirm(id: number, state: number): Promise<any>{
        const confirm = await this._labOrderRepository.createQueryBuilder()
        .update(LabOrder).set({state})
        .where({id}).execute();
        return confirm;
    }

    async getCantMonth(month: number, year: number): Promise<any>{
        const cant = await this._labOrderRepository.createQueryBuilder('lo')
        .where('EXTRACT(month FROM "date") = :month AND EXTRACT(YEAR FROM "date") = :year AND state <> 0',{month,year})
        .getCount();
        return cant;
    }

    //Reports

    /**
     * Metodo para los reportes de aparatos
     * elaborados vs no elaborados
     */
    async getReportElaboNoElabo(filters: any): Promise<any>{
        const data = await this._labOrderRepository.createQueryBuilder('lo')
        .select(`qt.idclinichistory,
        ch.history,
        concat_ws(' ',ch.name,"ch"."lastNameFather","ch"."lastNameMother") AS name,
        lo.state,
        lo.job,
        lo.instalation,
        tr.description AS aparato`)
        .innerJoin('quotation_detail','qd','qd.id = "lo"."quotationDetailId"')
        .innerJoin('quotation','qt','qt.id = qd.idquotation')
        .innerJoin('clinic_history','ch','ch.id = qt.idclinichistory')
        .innerJoin('tariff','tr','tr.id = "lo"."tariffId"')
        .where(`lo.instalation BETWEEN :since AND :until AND lo.state IN(1,2)`,{since: filters.since,until: filters.until})
        .orderBy('lo.elaboration')
        .getRawMany();
        return data;
    }

    /**
     * Metodo para los reportes de AOF
     * produciodos
     */
     async getReportElaboProd(filters: any): Promise<any>{
        let data = await this._labOrderRepository.createQueryBuilder('lo')
        .select(`tr.name,
        count(lo.*) AS cantidad,
        sum(tr.price_usd) AS valor`)
        .innerJoin('tariff','tr','tr.id = "lo"."tariffId" and tr.bracket = true')
        .where(`lo.state <> 0 AND lo.job in('Nuevo','Nuevo Adicional')
        and lo.elaboration BETWEEN :since AND :until`,{since: filters.since,until: filters.until})
        .groupBy('tr.name')
        .limit(filters.limit)
        .getRawMany();
        return data;
    }

    /**
     * Metodo para el reporte de AOF
     * por estados
     */
    async getReportbyState(filters: any): Promise<any>{
        let data = await this._labOrderRepository.createQueryBuilder('lo')
        .select(`lo.job,
        count(lo.*) AS cantidad,
        sum(tr.price_usd) AS valor`)
        .innerJoin('tariff','tr','tr.id = "lo"."tariffId" and tr.bracket = true')
        .where(`lo.state <> 0
        and lo.elaboration BETWEEN :since AND :until`,{since: filters.since,until: filters.until})
        .groupBy('lo.job')
        .orderBy('lo.job')
        .getRawMany();
        return data;
    }
}
