import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Responsible } from './responsible.entity';
import { ResponsibleRepository } from './responsible.repository';

@Injectable()
export class ResponsibleService {

    constructor(
        @InjectRepository(ResponsibleRepository)
        private readonly _ResponsibleRepository: ResponsibleRepository
    ){}

    async get(id: number): Promise<Responsible>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const Responsible = await this._ResponsibleRepository.findOne(id,{where:{state:1}});

        if(!Responsible){
            throw new NotFoundException();
        }

        return Responsible;
    }

    async getAll(): Promise<Responsible[]>{
        const Responsible: Responsible[] = await this._ResponsibleRepository.find({where:{state:1}});
        return Responsible;
    }

    async create(bl: Responsible): Promise<Responsible>{
        const saveResponsible: Responsible = await this._ResponsibleRepository.save(bl);
        return saveResponsible;
    }

    async update(id: number, Responsible:Responsible): Promise<Responsible>{
        const ResponsibleExists = await this._ResponsibleRepository.findOne(id);
        if(!ResponsibleExists){
            throw new NotFoundException();
        }
        await this._ResponsibleRepository.update(id,Responsible);
        const updateResponsible : Responsible = await this._ResponsibleRepository.findOne(id);
        return updateResponsible;
    }

    async delete(id: number): Promise<void>{
        const ResponsibleExists = await this._ResponsibleRepository.findOne(id);
        if(!ResponsibleExists){
            throw new NotFoundException();
        }

        await this._ResponsibleRepository.update(id,{state:0});
    }
}