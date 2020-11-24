import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campus } from './campus.entity';
import { CampusRepository } from './campus.repository';

@Injectable()
export class CampusService {

    constructor(
        @InjectRepository(CampusRepository)
        private readonly _campusRepository: CampusRepository
    ){}

    async get(id: number): Promise<Campus>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const campus = await this._campusRepository.findOne(id,{where:{state:1}});

        if(!campus){
            throw new NotFoundException();
        }

        return campus;
    }

    async getAll(): Promise<Campus[]>{
        const campus: Campus[] = await this._campusRepository.find({where:{state:1}});
        return campus;
    }

    async create(bl: Campus): Promise<Campus>{
        const saveCampus: Campus = await this._campusRepository.save(bl);
        return saveCampus;
    }

    async update(id: number, campus:Campus): Promise<Campus>{
        const campusExists = await this._campusRepository.findOne(id);
        if(!campusExists){
            throw new NotFoundException();
        }
        await this._campusRepository.update(id,campus);
        const updateCampus : Campus = await this._campusRepository.findOne(id);
        return updateCampus;
    }

    async delete(id: number): Promise<void>{
        const campusExists = await this._campusRepository.findOne(id);
        if(!campusExists){
            throw new NotFoundException();
        }

        await this._campusRepository.update(id,{state:0});
    }
}
