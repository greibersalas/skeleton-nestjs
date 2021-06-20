import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, } from 'typeorm';

import { ClinicHistory } from './clinic-history.entity';
import { ClinicHistoryRepository } from './clinic-history.repository';

@Injectable()
export class ClinicHistoryService {

    constructor(
        @InjectRepository(ClinicHistoryRepository)
        private readonly _clinicHistoryRepository: ClinicHistoryRepository
    ){}

    async get(id: number): Promise<ClinicHistory>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const clinicHistory = await this._clinicHistoryRepository.findOne(id,{where:{state:1}});
        if(!clinicHistory){
            throw new NotFoundException();
        }
        return clinicHistory;
    }

    async getAll(): Promise<ClinicHistory[]>{
        const clinicHistory: ClinicHistory[] = await this._clinicHistoryRepository.find({where:{state:1}});
        return clinicHistory;
    }

    async create(bl: ClinicHistory): Promise<ClinicHistory>{
        bl.insuranceCarrier = null;
        const saveClinicHistory: ClinicHistory = await this._clinicHistoryRepository.save(bl);
        return saveClinicHistory;
    }

    async update(id: number, clinicHistory:ClinicHistory): Promise<ClinicHistory>{
        const clinicHistoryExists = await this._clinicHistoryRepository.findOne(id);
        if(!clinicHistoryExists){
            throw new NotFoundException();
        }
        await this._clinicHistoryRepository.update(id,clinicHistory);
        const updateClinicHistory : ClinicHistory = await this._clinicHistoryRepository.findOne(id);
        return updateClinicHistory;
    }

    async delete(id: number): Promise<void>{
        const clinicHistoryExists = await this._clinicHistoryRepository.findOne(id);
        if(!clinicHistoryExists){
            throw new NotFoundException();
        }

        await this._clinicHistoryRepository.update(id,{state:0});
    }

    async getByDocumentNumber(document: string): Promise<ClinicHistory>{
        if(!document){
            throw new BadRequestException('document number must be send.');
        }
        const clinicHistory = await this._clinicHistoryRepository.findOne({where:{documentNumber:document,state:1}});
        if(!clinicHistory){
            throw new NotFoundException();
        }
        return clinicHistory;
    }

    async getLastHistoryNumber(campus: number): Promise<number>{
        if(!campus){
            throw new BadRequestException('campus id number must be send');
        }
        const numberHistory = await this._clinicHistoryRepository
        .createQueryBuilder("ch")
        .select("ch.history_correlative")
        .where("ch.campus = :campus",{campus})
        .orderBy({"ch.id":"DESC"})
        .limit(1)
        .getOne();
        if(numberHistory){
            return numberHistory.history_correlative;
        }else{
            return 0;
        }
    }

    async getPdfFichaData(id: number): Promise<any>{
        let data: any;
        const patient = await this._clinicHistoryRepository.createQueryBuilder('pt')
        .select(`pt.*,dt.name as distrito, an.emergency_contact_name as contacto,
        an.emergency_contact_cellphone as contacto_telefono, an.medic_name as medico_confianza,
        an.medic_cellphone as medico_confianza_telefono`)
        .innerJoin("districts","dt","dt.id = pt.district")
        .leftJoin("anamnesis","an","an.clinichistoryId = pt.id")
        .where(`pt.id = :id`,{id})
        .getRawOne();
        if(!patient){
            throw new NotFoundException();
        }
        data = {
            patient
        };
        return data;
    }

    async validateNumDoc(documentNumber: string): Promise<boolean>{
        const exist = await this._clinicHistoryRepository.find({
            where: {
                documentNumber
            }
        });
        if(exist.length > 0){
            return true;
        }
        return false;
    }

    async getListWithPagination(start:number,length:number,search:any,order:any):Promise<any>{
        var column = ["id","history","name","documentNumber","cellphone","email"]
        var query ={}
        var orderparams = {}
        if (search.value != ''){
            query = [
                {state:1,history:Like("%" + search.value + "%")},
                {state:1,name:Like("%" + search.value + "%")},
                {state:1,lastNameFather:Like("%" + search.value + "%")},
                {state:1,lastNameMother:Like("%" + search.value + "%")},
                {state:1,email:Like("%" + search.value + "%")},
                {state:1,documentNumber:Like("%" + search.value + "%")},
                {state:1,cellphone:Like("%" + search.value + "%")},
            ]
        }
        else
            query={
                state:1
            }
        
        if (order[0].column > 0){
            orderparams[String(column[order[0].column])]=String(order[0].dir).toUpperCase()
            
        }
        const [result, total] = await this._clinicHistoryRepository.findAndCount({
            where:query,
            order:orderparams,
            take:length,
            skip:start
        });
        const response = {
            data: result,
            recordsTotal: total,
            recordsFiltered:total
        }
        return response;
    }

}
