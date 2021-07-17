import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MedicalAct } from './medical-act.entity';
import { MedicalActRepository } from './medical-act.repository';
import { MedicalActFilesRepository } from './medical-act-files.repository';
import { MedicalActFileGroupRepository } from './medical-act-file-group.repository';
import { MedicalActFileGroup } from './medical-act-file-group.entity';
import { MedicalActFiles } from './medical-act-files.entity';
import { ReservationRepository } from '../../reservation/reservation.repository';
import { Reservation } from '../../reservation/reservation.entity';

@Injectable()
export class MedicalActService {

    constructor(
        @InjectRepository(MedicalActRepository)
        private readonly _medicalActRepository: MedicalActRepository,
        @InjectRepository(MedicalActFilesRepository)
        private readonly _medicalActFilesRepository: MedicalActFilesRepository,
        @InjectRepository(MedicalActFileGroupRepository)
        private readonly _medicalActFileGroupRepository: MedicalActFileGroupRepository,
        @InjectRepository(ReservationRepository)
        private readonly _ReservationRepository: ReservationRepository
    ){}

    async get(id: number): Promise<MedicalAct>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const medicalAct = await this._medicalActRepository.findOne(id,{where:{state:1}});
        if(!medicalAct){
            throw new NotFoundException();
        }
        return medicalAct;
    }

    async getAll(): Promise<MedicalAct[]>{
        const medicalAct: MedicalAct[] = await this._medicalActRepository.find({where:{state:1}});
        return medicalAct;
    }

    async create(medicalAct: MedicalAct): Promise<MedicalAct>{
        const saveMedicalAct: MedicalAct = await this._medicalActRepository.save(medicalAct);
        //CAMBIAMOS EL ESTADO DE LA RESERVA
        await this._ReservationRepository.createQueryBuilder()
        .update(Reservation)
        .set({state: 3})
        .where({id:medicalAct.reservation}).execute();
        return saveMedicalAct;
    }

    async update(id: number, medicalAct:MedicalAct): Promise<MedicalAct>{
        const medicalActExists = await this._medicalActRepository.findOne(id);
        if(!medicalActExists){
            throw new NotFoundException();
        }
        await this._medicalActRepository.update(id,medicalAct);
        const updateMedicalAct : MedicalAct = await this._medicalActRepository.findOne(id);
        return updateMedicalAct;
    }

    async delete(id: number): Promise<void>{
        const medicalActExists = await this._medicalActRepository.findOne(id);
        if(!medicalActExists){
            throw new NotFoundException();
        }
        await this._medicalActRepository.update(id,{state:0});
    }

    /**
     * Return list of odontogramas by clinichistory
     * @param id <clinic history>
     */
    async getByReservation(id: number): Promise<MedicalAct>{
        const ma: MedicalAct = await this._medicalActRepository.findOne(
            {
                where: {
                    state: 1,
                    reservation: id
                }
            }
        );
        if(!ma){
            throw new NotFoundException;
        }
        return ma;
    }

    async addFiles(data: any): Promise<any>{
        return await this._medicalActFilesRepository.save(data);
    }

    async getAllGroup(): Promise<MedicalActFileGroup[]>{
        const medicalActFileGroup: MedicalActFileGroup[] = await this._medicalActFileGroupRepository.find({where:{state:1}});
        return medicalActFileGroup;
    }

    async createGroup(medicalActFileGroup: MedicalActFileGroup): Promise<MedicalActFileGroup>{
        const save: MedicalActFileGroup = await this._medicalActFileGroupRepository.save(medicalActFileGroup);
        return save;
    }

    async updateGroup(id: number, medicalActFileGroup:MedicalActFileGroup): Promise<MedicalActFileGroup>{
        const exists = await this._medicalActFileGroupRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._medicalActFileGroupRepository.update(id,medicalActFileGroup);
        const update : MedicalActFileGroup = await this._medicalActFileGroupRepository.findOne(id);
        return update;
    }

    /**
     * Return list of files by clinichistory
     * @param id <clinic history>
     */
    async getFilesByClinicHistory(id: number): Promise<MedicalActFiles[]>{
        const ma: MedicalActFiles[] = await this._medicalActFilesRepository
        .createQueryBuilder("fl")
        //.innerJoinAndSelect("fl.medicalact","ma","ma.state = :state",{state: 1})
        //.innerJoin("ma.reservation","rs","rs.state = 3")
        //.innerJoin("rs.patient","ch","ch.id = :id",{id})
        //.innerJoin("rs.qdetail","dq")
        //.innerJoin("dq.quotation","qt")
        .innerJoinAndSelect("fl.filegroup","fg")
        .where({state: 1,clinichistory:id})
        .orderBy({"fl.id":'DESC'})
        .getMany();
        return ma;
    }

    /**
     * Return list of files by medical_act
     * @param id <clinic history>
     */
    async getFilesByMedicalAct(id: number): Promise<MedicalActFiles[]>{
        const ma: MedicalActFiles[] = await this._medicalActFilesRepository
        .createQueryBuilder("fl")
        .innerJoin("fl.medicalact","ma","ma.id = :id",{id})
        .innerJoinAndSelect("fl.filegroup","fg")
        .where({state: 1})
        .orderBy({"fl.id":'DESC'})
        .getMany();
        return ma;
    }

    async getByClinicHistory(id: number): Promise<any[]>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const medicalAct = await this._medicalActRepository.createQueryBuilder('ma')
        .innerJoinAndSelect("ma.reservation","re")
        .innerJoinAndSelect("re.patient","ch","ch.id = :id",{id})
        .innerJoinAndSelect("re.doctor","dc")
        .innerJoinAndSelect("re.environment","en")
        .leftJoinAndSelect("re.tariff","tr")
        .where("re.state <> 0").orderBy({"re.id" : "DESC"})
        .getMany();
        if(!medicalAct){
            throw new NotFoundException();
        }
        return medicalAct;
    }

    async getFile(id: number): Promise<MedicalActFiles>{
        const file: MedicalActFiles = await this._medicalActFilesRepository.findOne({id});
        if(!file){
            throw new NotFoundException();
        }
        return file;
    }

    async deleteFile(id: number): Promise<boolean>{
        const file: MedicalActFiles = await this._medicalActFilesRepository.findOne({id});
        if(!file){
            throw new NotFoundException();
        }
        const deleteFile = await this._medicalActFilesRepository.update(id,{state: 0});
        if(!deleteFile){
            throw new BadRequestException('id must be send.');
        }
        return true;
    }
}
