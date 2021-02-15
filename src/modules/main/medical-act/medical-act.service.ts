import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MedicalAct } from './medical-act.entity';
import { MedicalActRepository } from './medical-act.repository';

@Injectable()
export class MedicalActService {

    constructor(
        @InjectRepository(MedicalActRepository)
        private readonly _medicalActRepository: MedicalActRepository
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
}
