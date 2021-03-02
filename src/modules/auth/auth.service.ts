import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { SigninDto, SignupDto } from './dto';
import { User } from '../user/user.entity';
import { compare } from 'bcryptjs';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(AuthRepository)
        private readonly _authRepository: AuthRepository,
        private readonly _jwtServices: JwtService
    ){}

    async signup(signupDto: SignupDto): Promise<void>{
        const { username, email } = signupDto;
        const userExist = await this._authRepository.findOne({
            where: [{username},{email}]
        });

        if(userExist){
            throw new ConflictException('User or email already exists');
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
        const isMatch = await compare(password, user.password);
        if(!isMatch){
            throw new UnauthorizedException('invalid credentials');
        }
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
            doctor: user.doctor
        };
    }
}
