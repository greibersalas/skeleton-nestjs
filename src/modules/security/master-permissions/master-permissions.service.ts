import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PermissionsRepository } from '../permissions/permissions.repository';
import { MasterPermissions } from './master-permissions.entity';
import { MasterPermissionsRepository } from './master-permissions.repository';

@Injectable()
export class MasterPermissionsService {

    constructor(
        @InjectRepository(MasterPermissionsRepository)
        private readonly _permissionsRepository: MasterPermissionsRepository,
        @InjectRepository(PermissionsRepository)
        private readonly repositoryPermission: PermissionsRepository
    ) { }

    async get(id: number): Promise<MasterPermissions> {
        if (!id) {
            throw new BadRequestException('id must be send');
        }
        const permissions = await this._permissionsRepository.findOne(id, { where: { estado: 1 } });
        if (!permissions) {
            throw new NotFoundException();
        }
        return permissions;
    }

    async getAll(): Promise<MasterPermissions[]> {
        return await this._permissionsRepository.find({ where: { estado: 1 } });
    }

    async getNotUser(iduser: number): Promise<MasterPermissions[]> {
        const subQuery: string = this.repositoryPermission.createQueryBuilder('pr')
            .select('mpermissions_id')
            .where(`user_id = ${iduser}`)
            .andWhere('estado = 1')
            .getQuery();
        return await this._permissionsRepository.createQueryBuilder('mp')
            .select(`mp.id, mp.page, mp.description`)
            .where(`id NOT IN(${subQuery})`)
            .andWhere(`estado <> 0`)
            .orderBy('mp.description')
            .getRawMany();
    }

    async create(permissions: MasterPermissions): Promise<MasterPermissions> {
        const saveMasterPermissions: MasterPermissions = await this._permissionsRepository.save(permissions);
        return saveMasterPermissions;
    }

    async update(id: number, permissions: MasterPermissions): Promise<void> {
        await this._permissionsRepository.update(id, permissions);
    }

    async delete(id: number): Promise<void> {
        const permissionsExists = await this._permissionsRepository.findOne(id, { where: { estado: 1 } });
        if (!permissionsExists) {
            throw new NotFoundException();
        }
        await this._permissionsRepository.update(id, { estado: 0 });
    }
}
