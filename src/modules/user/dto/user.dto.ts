import { isNotEmpty, IsNotEmpty } from "class-validator";
import { Role } from "../../../modules/role/role.entity";
import { UserDetails } from "../user.details.entity";

export class UserDto{

    @IsNotEmpty()
    id:number;

    @IsNotEmpty()
    username:string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    roles: Role;

    campus: number[];

}