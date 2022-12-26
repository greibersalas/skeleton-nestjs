import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modules } from '../module/module.entity';
import { SubModules } from './entity/sub-module.entity';

@Injectable()
export class SubModuleService {

    constructor(
        @InjectRepository(Modules)
        private readonly moduleRepository: Repository<Modules>,
        @InjectRepository(SubModules)
        private readonly repository: Repository<SubModules>
    ) { }

    async get(id: number): Promise<SubModules> {
        if (!id) {
            throw new BadRequestException('id must be send');
        }
        const module = await this.repository.findOne(id, { where: { status: 1 } });
        if (!module) {
            throw new NotFoundException();
        }
        return module;
    }

    async getAll(): Promise<SubModules[]> {
        return await this.repository.find({ where: { status: 1 } });
    }

    async create(submodule: SubModules): Promise<SubModules> {
        return await this.repository.save(submodule);
    }

    async update(id: number, module: SubModules): Promise<void> {
        await this.repository.update(id, module);
    }

    async delete(id: number): Promise<void> {
        const moduleExists = await this.repository.findOne(id, { where: { status: 1 } });

        if (!moduleExists) {
            throw new NotFoundException();
        }
        moduleExists.status = 0;
        moduleExists.save();
    }
}
