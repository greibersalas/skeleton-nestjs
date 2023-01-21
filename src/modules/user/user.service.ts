import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';

import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private readonly _userRepository: UserRepository) {

    }

    async get(id: number): Promise<User> {
        if (!id) {
            throw new BadRequestException('id must be send');
        }
        //const user = await this._userRepository.findOne(id,{where:{estado:1}});
        const user = await this._userRepository.createQueryBuilder("us")
            .innerJoinAndSelect("us.roles", "rl")
            .leftJoinAndSelect("us.doctor", "dc")
            .where("us.id = :id AND us.estado <> 0", { id }).getOne();
        if (!user) {
            throw new NotFoundException();
        }
        user.password = '****';
        return user;
    }

    async getAll(): Promise<User[]> {
        const users: User[] = await this._userRepository.createQueryBuilder('us')
            .innerJoinAndSelect('us.roles', 'ro')
            .where('us.estado <> 0')
            .orderBy('us.username')
            .getMany();

        return users;
    }

    async create(user: User): Promise<User> {
        const saveUser: User = await this._userRepository.save(user);
        return saveUser;
    }

    async update(id: number, user: User): Promise<any> {
        //const update = await this._userRepository.update(id,user);
        const update = await this._userRepository.createQueryBuilder()
            .update(User).set({
                username: user.username,
                email: user.email,
                roles: user.roles,
                doctor: user.doctor,
                campus: user.campus
            }).where({ id }).execute();
        return update;
    }

    async delete(id: number): Promise<void> {
        const userExists = await this._userRepository.findOne(id, { where: { estado: 1 } });

        if (!userExists) {
            throw new NotFoundException();
        }

        await this._userRepository.update(id, { estado: 0 });
    }

    async changeState(id: number, state: number): Promise<any> {
        const userExists = await this._userRepository.findOne(id);

        if (!userExists) {
            throw new NotFoundException();
        }

        return await this._userRepository.update(id, { estado: state });
    }

    async autorizationUser(password: string): Promise<User> {
        const users: User[] = await this._userRepository.createQueryBuilder("us")
            .innerJoinAndSelect("us.roles", "rl")
            .where('us.estado = 1')
            .andWhere('rl.idrole IN(1,2)')
            .getMany();
        if (!users) {
            throw new NotFoundException('User does not exist');
        }
        let isMatch = false;
        for await (const user of users) {
            isMatch = await compare(password, user.password);
            if (isMatch) {
                return user
            }
        }
        if (!isMatch) {
            throw new UnauthorizedException('invalid credentials');
        }
    }
}
