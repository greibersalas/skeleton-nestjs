import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';

import { IJwtPayload } from './jwt-payload.interface';
import { SigninDto, SignupDto } from './dto';
import { User } from '../user/user.entity';
import { AuthRepository } from './auth.repository';
import { PermissionsRepository } from '../security/permissions/permissions.repository';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(AuthRepository)
        private readonly _authRepository: AuthRepository,
        private _permission: PermissionsRepository,
        private readonly _jwtServices: JwtService
    ){}

    async signup(signupDto: SignupDto): Promise<void>{
        const { username, email } = signupDto;
        const userExist = await this._authRepository.findOne({
            where: [{username},{email}]
        });

        if(userExist){
            throw new ConflictException('El usuario o el email ya se encuentra registrado');
        }

        return this._authRepository.signup(signupDto);
    }

    async signin(signinDto: SigninDto): Promise<any>{
        const { username, password } = signinDto;
        const user: User = await this._authRepository.createQueryBuilder("us")
        .innerJoinAndSelect("us.roles","rl")
        .leftJoinAndSelect("us.doctor","dc")
        .where({username}).getOne();
        if(!user){
            throw new NotFoundException('User does not exist');
        }
        // const isMatch = await compare(password, user.password);
        // if(!isMatch){
        //     throw new UnauthorizedException('invalid credentials');
        // }
        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles
        };
        const token = this._jwtServices.sign(payload);
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles,
            token,
            capmus: user.campus,
            doctor: user.doctor,
            state: user.estado
        };
    }

    async changePassword(id: number, signupDto: SignupDto): Promise<any>{
        const userExist = await this._authRepository.findOne({
            where: [{id}]
        });

        if(!userExist){
            throw new NotFoundException();
        }
        const salt = await genSalt(10);
        const password = await hash(signupDto.password, salt);
        const change = this._authRepository.createQueryBuilder()
        .update(User).set({password}).where({id}).execute();
        return change;
    }
}
