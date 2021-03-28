import { EntityRepository, Repository } from "typeorm";
import { User } from "../user/user.entity";
import { SignupDto} from './dto';
import { genSalt, hash } from 'bcryptjs';

@EntityRepository(User)
export class AuthRepository extends Repository<User>{

    async signup(signupDto: SignupDto){
        const { username, email, password, roles } = signupDto;
        const user = new User();
        user.username = username;
        user.email = email;
        user.roles = roles;
        const salt = await genSalt(10);
        user.password = await hash(password, salt);
        await user.save();
    }
}