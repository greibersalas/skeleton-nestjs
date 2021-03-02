import { EntityRepository, getConnection, Repository } from "typeorm";
import { Role } from "../role/role.entity";
import { RoleRepository } from "../role/role.repository";
import { UserDetails } from "../user/user.details.entity";
import { User } from "../user/user.entity";
import { SignupDto} from './dto';
import { genSalt, hash } from 'bcryptjs';

@EntityRepository(User)
export class AuthRepository extends Repository<User>{

    async signup(signupDto: SignupDto){
        const { username, email, password, roles, campus } = signupDto;
        const user = new User();

        user.username = username;
        user.email = email;
        user.campus = campus;

        const roleRepository: RoleRepository = await getConnection().getRepository(Role);

        const defaultRole: Role = await roleRepository.findOne({where:{idrole:roles.idrole}});
        user.roles = defaultRole;

        /* const details = new UserDetails();
        details.name = name;
        details.lastname = lastname;
        details.save();
        user.details = details; */

        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        await user.save();
    }
}