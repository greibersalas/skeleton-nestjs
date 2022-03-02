import { IsNotEmpty } from "class-validator";
import { Role } from "../../security/role/role.entity";

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