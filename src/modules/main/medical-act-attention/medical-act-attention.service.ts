import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalActAttention } from './medical-act-attention.entity';
import { MedicalActAttentionRepository } from './medical-act-attention.repository';

@Injectable()
export class MedicalActAttentionService {

    constructor(
        @InjectRepository(MedicalActAttentionRepository)
        private readonly _medicalActAttentionRepository: MedicalActAttentionRepository
    ){}

    async get(id: number): Promise<MedicalActAttention>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const medicalActAttention = await this._medicalActAttentionRepository.findOne(id,{where:{state:1}});

        if(!medicalActAttention){
            throw new NotFoundException();
        }

        return medicalActAttention;
    }

    async getAll(): Promise<MedicalActAttention[]>{
        const medicalActAttention: MedicalActAttention[] = await this._medicalActAttentionRepository.find({where:{state:1}});
        return medicalActAttention;
    }

    async create(medicalActAttention: MedicalActAttention): Promise<MedicalActAttention>{
        const saveMedicalActAttention: MedicalActAttention = await this._medicalActAttentionRepository.save(medicalActAttention);
        return saveMedicalActAttention;
    }

    async update(id: number, medicalActAttention:MedicalActAttention): Promise<MedicalActAttention>{
        const medicalActAttentionExists = await this._medicalActAttentionRepository.findOne(id);
        if(!medicalActAttentionExists){
            throw new NotFoundException();
        }
        await this._medicalActAttentionRepository.update(id,medicalActAttention);
        const updateMedicalActAttention : MedicalActAttention = await this._medicalActAttentionRepository.findOne(id);
        return updateMedicalActAttention;
    }

    async delete(id: number): Promise<void>{
        const medicalActAttentionExists = await this._medicalActAttentionRepository.findOne(id);
        if(!medicalActAttentionExists){
            throw new NotFoundException();
        }
        await this._medicalActAttentionRepository.update(id,{state:0});
    }

    async getByMedicalAct(id: number): Promise<MedicalActAttention[]>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        //const medicalActAttention = await this._medicalActAttentionRepository.find({where:{state:1,medicalact:id}});
        const medicalActAttention = await this._medicalActAttentionRepository.createQueryBuilder('mc')
        .innerJoinAndSelect("mc.tariff","tr")
        .innerJoinAndSelect("tr.specialty","sp")
        .innerJoinAndSelect("sp.businessLines","bl")
        .innerJoinAndSelect("mc.doctor",'dc')
        .where("mc.state = 1 AND mc.medicalact = :id",{id})
        .getMany();

        if(!medicalActAttention){
            throw new NotFoundException();
        }
        return medicalActAttention;
    }

    async cantReservation(month: number, year: number): Promise<any>{
        const cant = await this._medicalActAttentionRepository.createQueryBuilder('re')
        .where('EXTRACT(month FROM "date") = :month AND EXTRACT(YEAR FROM "date") = :year AND state <> 0',{month,year})
        .getCount();
        return cant;
    }
}
