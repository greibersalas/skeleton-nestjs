import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provinces } from './provinces.entity';
import { ProvincesRepository } from './provinces.repository';

@Injectable()
export class ProvincesService {

    constructor(
        @InjectRepository(ProvincesRepository)
        private readonly _ProvincesRepository: ProvincesRepository
    ){}

    async get(id: number): Promise<Provinces>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const Provinces = await this._ProvincesRepository.findOne(id,{where:{state:1}});

        if(!Provinces){
            throw new NotFoundException();
        }

        return Provinces;
    }

    async getAll(): Promise<Provinces[]>{
        const Provinces: Provinces[] = await this._ProvincesRepository.find({where:{state:1}});
        return Provinces;
    }

    async create(bl: Provinces): Promise<Provinces>{
        const saveProvinces: Provinces = await this._ProvincesRepository.save(bl);
        return saveProvinces;
    }

    async update(id: number, Provinces:Provinces): Promise<Provinces>{
        const ProvincesExists = await this._ProvincesRepository.findOne(id);
        if(!ProvincesExists){
            throw new NotFoundException();
        }
        await this._ProvincesRepository.update(id,Provinces);
        const updateProvinces : Provinces = await this._ProvincesRepository.findOne(id);
        return updateProvinces;
    }

    async delete(id: number): Promise<void>{
        const ProvincesExists = await this._ProvincesRepository.findOne(id);
        if(!ProvincesExists){
            throw new NotFoundException();
        }

        await this._ProvincesRepository.update(id,{state:0});
    }
}
