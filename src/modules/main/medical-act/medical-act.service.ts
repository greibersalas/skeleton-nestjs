import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MedicalAct } from './medical-act.entity';
import { MedicalActRepository } from './medical-act.repository';
import { MedicalActFilesRepository } from './medical-act-files.repository';
import { MedicalActFileGroupRepository } from './medical-act-file-group.repository';
import { MedicalActFileGroup } from './medical-act-file-group.entity';

@Injectable()
export class MedicalActService {

    constructor(
        @InjectRepository(MedicalActRepository)
        private readonly _medicalActRepository: MedicalActRepository,
        @InjectRepository(MedicalActFilesRepository)
        private readonly _medicalActFilesRepository: MedicalActFilesRepository,
        @InjectRepository(MedicalActFileGroupRepository)
        private readonly _medicalActFileGroupRepository: MedicalActFileGroupRepository
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

    async addFiles(data: any): Promise<boolean>{
        await this._medicalActFilesRepository.save(data);
        return true;
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
}
