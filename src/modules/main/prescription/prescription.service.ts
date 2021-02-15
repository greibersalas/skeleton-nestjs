import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PrescriptionRepository } from './prescription.repository';
import { Prescription } from './prescription.entity';

@Injectable()
export class PrescriptionService {

    constructor(
        @InjectRepository(PrescriptionRepository)
        private readonly _prescriptionRepository: PrescriptionRepository
    ){}

    async get(id: number): Promise<Prescription>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const prescription = await this._prescriptionRepository.findOne(id,{where:{state:1}});

        if(!prescription){
            throw new NotFoundException();
        }

        return prescription;
    }

    async getAll(): Promise<Prescription[]>{
        const prescription: Prescription[] = await this._prescriptionRepository.find({where:{state:1}});
        return prescription;
    }

    async create(prescription: Prescription): Promise<Prescription>{
        const savePrescription: Prescription = await this._prescriptionRepository.save(prescription);
        return savePrescription;
    }

    async update(id: number, prescription:Prescription): Promise<Prescription>{
        const prescriptionExists = await this._prescriptionRepository.findOne(id);
        if(!prescriptionExists){
            throw new NotFoundException();
        }
        await this._prescriptionRepository.update(id,prescription);
        const updatePrescription : Prescription = await this._prescriptionRepository.findOne(id);
        return updatePrescription;
    }

    async delete(id: number): Promise<void>{
        const dentalStatusExists = await this._prescriptionRepository.findOne(id);
        if(!dentalStatusExists){
            throw new NotFoundException();
        }
        await this._prescriptionRepository.update(id,{state:0});
    }

    async getByPatient(id: number): Promise<Prescription[]>{
        return await this._prescriptionRepository.find(
            {
                where: {
                    state: 1,
                    clinichistory: id
                }
            }
        );
    }

    async getByMedicalAct(id: number): Promise<Prescription[]>{
        return await this._prescriptionRepository.find(
            {
                where: {
                    state: 1,
                    medicalact: id
                }
            }
        );
    }
}
