import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { DoctorRepository } from './doctor.repository';

@Injectable()
export class DoctorService {

    constructor(
        @InjectRepository(DoctorRepository)
        private readonly _doctorRepository: DoctorRepository
    ){}

    async get(id: number): Promise<Doctor>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const doctor = await this._doctorRepository.findOne(id,{where:{state:1}});

        if(!doctor){
            throw new NotFoundException();
        }

        return doctor;
    }

    async getAll(): Promise<Doctor[]>{
        const doctors: Doctor[] = await this._doctorRepository.find({where:{state:1}});
        return doctors;
    }

    async create(doctor: Doctor): Promise<Doctor>{
        const saveDoctor: Doctor = await this._doctorRepository.save(doctor);
        return saveDoctor;
    }

    async update(id: number, doctor:Doctor): Promise<Doctor>{
        const existsDoctor = await this._doctorRepository.findOne(id);
        if(!existsDoctor){
            throw new NotFoundException();
        }
        await this._doctorRepository.update(id,doctor);
        const updateDoctor : Doctor = await this._doctorRepository.findOne(id);
        return updateDoctor;
    }

    async delete(id: number): Promise<void>{
        const doctorExists = await this._doctorRepository.findOne(id);
        if(!doctorExists){
            throw new NotFoundException();
        }

        await this._doctorRepository.update(id,{state:0});
    }
}
