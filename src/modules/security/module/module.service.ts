import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ModuleDto } from './dto/module.dto';
import { Modules } from './module.entity';

@Injectable()
export class ModuleService {

    constructor(
        @InjectRepository(Modules)
        private readonly repository: Repository<Modules>
    ) { }

    async get(id: number): Promise<Modules> {
        if (!id) {
            throw new BadRequestException('id must be send');
        }
        const module = await this.repository.findOne(id, { where: { status: 1 } });
        if (!module) {
            throw new NotFoundException();
        }
        return module;
    }

    async getAll(): Promise<Modules[]> {
        return await this.repository.find({ where: { status: 1 } });
    }

    async create(module: Modules): Promise<Modules> {
        return await this.repository.save(module);
    }

    async update(id: number, module: Modules): Promise<void> {
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
