import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from './specialty.entity';
import { SpecialtyRepository } from './specialty.repository';

@Injectable()
export class SpecialtyService {

    constructor(
        @InjectRepository(SpecialtyRepository)
        private readonly _specialtyRepository: SpecialtyRepository
    ){}

    async get(id: number): Promise<Specialty>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const specialty = await this._specialtyRepository.findOne(id,{where:{state:1}});

        if(!specialty){
            throw new NotFoundException();
        }

        return specialty;
    }

    async getAll(): Promise<Specialty[]>{
        const specialty: Specialty[] = await this._specialtyRepository.find({where:{state:1}});
        return specialty;
    }

    async create(bl: Specialty): Promise<Specialty>{
        const saveSpecialty: Specialty = await this._specialtyRepository.save(bl);
        return saveSpecialty;
    }

    async update(id: number, specialty:Specialty): Promise<Specialty>{
        const specialtyExists = await this._specialtyRepository.findOne(id);
        if(!specialtyExists){
            throw new NotFoundException();
        }
        await this._specialtyRepository.update(id,specialty);
        const updateSpecialty : Specialty = await this._specialtyRepository.findOne(id);
        return updateSpecialty;
    }

    async delete(id: number): Promise<void>{
        const specialtyExists = await this._specialtyRepository.findOne(id);
        if(!specialtyExists){
            throw new NotFoundException();
        }

        await this._specialtyRepository.update(id,{state:0});
    }
}
