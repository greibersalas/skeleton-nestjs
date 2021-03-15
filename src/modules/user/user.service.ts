import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private readonly _userRepository:UserRepository){

    }

    async get(id: number): Promise<User>{
        if(!id){
            throw new BadRequestException('id must be send');
        }
        //const user = await this._userRepository.findOne(id,{where:{estado:1}});
        const user = await this._userRepository.createQueryBuilder("us")
        .innerJoinAndSelect("us.roles","rl")
        .leftJoinAndSelect("us.doctor","dc")
        .where("us.id = :id AND us.estado = 1",{id}).getOne();
        if(!user){
            throw new NotFoundException();
        }
        user.password = '****';
        return user;
    }

    async getAll(): Promise<User[]>{
        const users: User[] = await this._userRepository.find({where:{estado:1}});
        return users;
    }

    async create(user: User): Promise<User>{
        const saveUser: User = await this._userRepository.save(user);
        return saveUser;
    }

    async update(id: number, user: User): Promise<any>{
        const update = await this._userRepository.update(id,user);
        return update;
    }

    async delete(id: number): Promise<void>{
        const userExists = await this._userRepository.findOne(id,{where:{estado:1}});

        if(!userExists){
            throw new NotFoundException();
        }

        await this._userRepository.update(id,{estado:0});
    }
}
