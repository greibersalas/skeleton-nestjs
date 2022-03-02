import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(RoleRepository) private readonly _roleRepository:RoleRepository){}

    async get(id: number): Promise<Role>{
        if(!id){
            throw new BadRequestException('id must be send');
        }

        const role = await this._roleRepository.findOne(id,{where:{estado:1}});

        if(!role){
            throw new NotFoundException();
        }

        return role;
    }

    async getAll(): Promise<Role[]>{        
        const roles: Role[] = await this._roleRepository.find({where:{estado:1}});
        return roles;
    }

    async create(role: Role): Promise<Role>{
        
        const saveRole: Role = await this._roleRepository.save(role);
        return saveRole;
    }

    async update(id: number, role: Role): Promise<void>{
        await this._roleRepository.update(id,role);
    }

    async delete(id: number): Promise<void>{
        const roleExists = await this._roleRepository.findOne(id,{where:{estado:1}});

        if(!roleExists){
            throw new NotFoundException();
        }

        await this._roleRepository.update(id,{estado:0});
    }
}
