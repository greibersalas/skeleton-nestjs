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

    async getCant(date: Date, job: string): Promise<number>{
        const cant = await this._labOrderRepository.createQueryBuilder()
        //.select('count(id) as total')
        .where('job = :job AND instalation = :date AND state = 1',{
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
                .where(`instalation::DATE BETWEEN :since AND :until AND state = 1`,{    
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
                .where(`instalation::DATE BETWEEN :since AND :until AND state = 1
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
                .where(`elaboration::DATE BETWEEN :since AND :until AND state = 1`,{    
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
                .where(`elaboration::DATE BETWEEN :since AND :until AND state = 1
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
                .where(`lo.instalation::DATE BETWEEN :since AND :until AND lo.state = 1`,{    
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
                .where(`lo.instalation::DATE BETWEEN :since AND :until AND lo.state = 1
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
                .where(`lo.elaboration::DATE BETWEEN :since AND :until AND lo.state = 1`,{    
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
                .where(`lo.elaboration::DATE BETWEEN :since AND :until AND lo.state = 1
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
}