import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Districts } from './districts.entity';
import { DistrictsRepository } from './districts.repository';

@Injectable()
export class DistrictsService {

    constructor(
        @InjectRepository(DistrictsRepository)
        private readonly _DistrictsRepository: DistrictsRepository
    ){}

    async get(id: number): Promise<Districts>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const Districts = await this._DistrictsRepository.findOne(id,{where:{state:1}});

        if(!Districts){
            throw new NotFoundException();
        }

        return Districts;
    }

    async getAll(): Promise<Districts[]>{
        const Districts: Districts[] = await this._DistrictsRepository.find({where:{state:1}});
        return Districts;
    }

    async create(bl: Districts): Promise<Districts>{
        const saveDistricts: Districts = await this._DistrictsRepository.save(bl);
        return saveDistricts;
    }

    async update(id: number, Districts:Districts): Promise<Districts>{
        const DistrictsExists = await this._DistrictsRepository.findOne(id);
        if(!DistrictsExists){
            throw new NotFoundException();
        }
        await this._DistrictsRepository.update(id,Districts);
        const updateDistricts : Districts = await this._DistrictsRepository.findOne(id);
        return updateDistricts;
    }

    async delete(id: number): Promise<void>{
        const DistrictsExists = await this._DistrictsRepository.findOne(id);
        if(!DistrictsExists){
            throw new NotFoundException();
        }

        await this._DistrictsRepository.update(id,{state:0});
    }
}
