import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { SubModules } from '../sub-module/entity/sub-module.entity';
import { ModulesPermissionsDto } from './dto/module-permissions-dto';
import { NavigationItemDto } from './dto/modules-navigation-dto';
import { ModulesUserDto } from './dto/modules-user-dto';
import { PermissionsMultiModules } from './dto/permissions-multimodules-dto';
import { ModulesPermissions } from './entity/module-user.entity';

@Injectable()
export class ModulesUserService {

    constructor(
        @InjectRepository(ModulesPermissions)
        private readonly repository: Repository<ModulesPermissions>,
        @InjectRepository(SubModules)
        private readonly subModulesRepository: Repository<SubModules>
    ) { }

    async get(id: number): Promise<ModulesPermissions> {
        if (!id) {
            throw new BadRequestException('id must be send');
        }
        const module = await this.repository.findOne(id, { where: { status: 1 } });
        if (!module) {
            throw new NotFoundException();
        }
        return module;
    }

    async getAll(): Promise<ModulesPermissions[]> {
        return await this.repository.find({ where: { status: 1 } });
    }

    async create(submodule: ModulesPermissions): Promise<ModulesPermissions> {
        return await this.repository.save(submodule);
    }

    async insertMultiPermissions(data: PermissionsMultiModules, iduser: number): Promise<boolean> {
        /* const deleteData = await this.repository.createQueryBuilder('mp')
            .delete().where(`mp.iduser = ${iduser}`).execute();
        if (!deleteData) {
            throw new BadRequestException();
        } */
        const values: ModulesPermissions[] = [];
        data.idsubmodule.forEach(el => {
            const item: ModulesPermissions = new ModulesPermissions();
            item.user = data.iduser;
            item.submodule = el;
            item.active = true;
            item.can_insert = data.can_insert;
            item.can_update = data.can_update;
            item.can_delete = data.can_delete;
            item.status = 1;
            item.user_created = iduser;
            values.push(item);
        });
        // console.log({ values });
        try {
            const insert = await this.repository.createQueryBuilder('mp')
                .insert()
                .values(values)
                .execute();
            if (insert) {
                return true;
            }
        } catch (error) {
            console.log({ error });
            throw new BadRequestException();
        }
    }

    async update(id: number, module: ModulesPermissions): Promise<void> {
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

    async getModulesUser(iduser: number): Promise<ModulesUserDto[]> {
        return await this.subModulesRepository.createQueryBuilder('ms')
            .distinct()
            .select('ms.idmodule, mo.name')
            .where('ms.status = 1')
            .andWhere('ms.idfather is not null')
            .innerJoin('modules', 'mo', `mo.id = ms.idmodule`)
            .innerJoin('modules_permissions', 'mp', `mp.idsubmodule = ms.id and mp.iduser = ${iduser} and mp.status = 1`)
            .orderBy('mo.name')
            .getRawMany();
    }

    async getSubModules(iduser: number, idmodule: number): Promise<NavigationItemDto[]> {
        return await this.subModulesRepository.createQueryBuilder('ms')
            .select(`mp.id AS idpermission, mp.active,
            mp.can_insert, mp.can_update, mp.can_delete, mosf.title as father,
            ms.*, mosf.icon AS icon_father`)
            .where('ms.status = 1')
            .andWhere('ms.idfather is not null')
            .andWhere(`ms.idmodule = ${idmodule}`)
            .innerJoin('modules_permissions', 'mp', `mp.idsubmodule = ms.id and mp.iduser = ${iduser} and mp.status = 1`)
            .innerJoin('modules_sub', 'mosf', `mosf.id = ms.idfather`)
            .orderBy('mosf.title')
            .addOrderBy('ms.title')
            .getRawMany();
    }
}
