import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterPermissions } from './master-permissions.entity';
import { MasterPermissionsRepository } from './master-permissions.repository';

@Injectable()
export class MasterPermissionsService {
    constructor(@InjectRepository(MasterPermissionsRepository) private readonly _permissionsRepository:MasterPermissionsRepository){}

    async get(id: number): Promise<MasterPermissions>{
        if(!id){
            throw new BadRequestException('id must be send');
        }

        const permissions = await this._permissionsRepository.findOne(id,{where:{estado:1}});

        if(!permissions){
            throw new NotFoundException();
        }

        return permissions;
    }

    async getAll(): Promise<MasterPermissions[]>{        
        const permissionss: MasterPermissions[] = await this._permissionsRepository.find({where:{estado:1}});
        return permissionss;
    }

    async create(permissions: MasterPermissions): Promise<MasterPermissions>{
        
        const saveMasterPermissions: MasterPermissions = await this._permissionsRepository.save(permissions);
        return saveMasterPermissions;
    }

    async update(id: number, permissions: MasterPermissions): Promise<void>{
        await this._permissionsRepository.update(id,permissions);
    }

    async delete(id: number): Promise<void>{
        const permissionsExists = await this._permissionsRepository.findOne(id,{where:{estado:1}});

        if(!permissionsExists){
            throw new NotFoundException();
        }

        await this._permissionsRepository.update(id,{estado:0});
    }
}
