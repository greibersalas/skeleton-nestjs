import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from './permissions.entity';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
    constructor(@InjectRepository(PermissionsRepository) private readonly _permissionsRepository:PermissionsRepository){}

    async get(id: number): Promise<Permissions>{
        if(!id){
            throw new BadRequestException('id must be send');
        }

        const permissions = await this._permissionsRepository.findOne(id,{where:{estado:1}});

        if(!permissions){
            throw new NotFoundException();
        }

        return permissions;
    }

    async getAll(): Promise<Permissions[]>{        
        const permissionss: Permissions[] = await this._permissionsRepository.find({where:{estado:1}});
        return permissionss;
    }

    async getByUser(user:number): Promise<Permissions[]>{
        const permissionss: Permissions[] = await this._permissionsRepository.find({where:{estado:1,user:user}});
        return permissionss;
    }

    async create(permissions: Permissions): Promise<Permissions>{
        
        const savePermissions: Permissions = await this._permissionsRepository.save(permissions);
        return savePermissions;
    }

    async update(id: number, permissions: Permissions): Promise<void>{
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
