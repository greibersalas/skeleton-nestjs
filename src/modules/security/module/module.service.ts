import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ModuleDto } from './dto/module.dto';
import { Module } from './module.entity';
import { ModuleRepository } from './module.repository';

@Injectable()
export class ModuleService {

    constructor(@InjectRepository(ModuleRepository) private readonly _moduleRepository:ModuleRepository){}

    async get(id: number): Promise<Module>{
        if(!id){
            throw new BadRequestException('id must be send');
        }
        const module = await this._moduleRepository.findOne(id,{where:{state:1}});
        if(!module){
            throw new NotFoundException();
        }
        return module;
    }

    async getAll(): Promise<ModuleDto[]>{
        const modules: ModuleDto[] = await this._moduleRepository.find({where:{state:1}});
        return modules;
    }

    async create(module: ModuleDto): Promise<ModuleDto>{
        const save: ModuleDto = await this._moduleRepository.save(module);
        return save;
    }

    async update(id: number, module: ModuleDto): Promise<void>{
        await this._moduleRepository.update(id,module);
    }

    async delete(id: number): Promise<void>{
        const moduleExists = await this._moduleRepository.findOne(id,{where:{state:1}});

        if(!moduleExists){
            throw new NotFoundException();
        }

        await this._moduleRepository.update(id,{state:0});
    }
}
