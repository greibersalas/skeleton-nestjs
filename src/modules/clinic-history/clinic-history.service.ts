import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
