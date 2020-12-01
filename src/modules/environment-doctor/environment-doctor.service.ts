import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvironmentDoctor } from './environment-doctor.entity';
import { EnvironmentDoctorRepository } from './environment-doctor.repository';

@Injectable()
export class EnvironmentDoctorService {

    constructor(
        @InjectRepository(EnvironmentDoctorRepository)
        private readonly _environmentDoctorRepository: EnvironmentDoctorRepository
    ){}

    async get(id: number): Promise<EnvironmentDoctor>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const environmentDoctor = await this._environmentDoctorRepository.findOne(id,{where:{state:1}});
        if(!environmentDoctor){
            throw new NotFoundException();
        }

        return environmentDoctor;
    }

    async getAll(): Promise<EnvironmentDoctor[]>{
        const ed: EnvironmentDoctor[] = await this._environmentDoctorRepository.find({where:{state:1}});
        return ed;
    }

    async create(ed: EnvironmentDoctor): Promise<EnvironmentDoctor>{
        const saveEd: EnvironmentDoctor = await this._environmentDoctorRepository.save(ed);
        return saveEd;
    }

    async update(id: number, ed: EnvironmentDoctor): Promise<EnvironmentDoctor>{
        const edExists = await this._environmentDoctorRepository.findOne(id);
        if(!edExists){
            throw new NotFoundException();
        }
        await this._environmentDoctorRepository.update(id,ed);
        const updateEd : EnvironmentDoctor = await this._environmentDoctorRepository.findOne(id);
        
        return updateEd;
    }

    async delete(id: number): Promise<void>{
        const edExists = await this._environmentDoctorRepository.findOne(id);
        if(!edExists){
            throw new NotFoundException();
        }
        await this._environmentDoctorRepository.update(id,{state:0});
    }

}
