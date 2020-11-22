import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService){}

    @Get(':id')
    async getUser(@Param('id',ParseIntPipe) id: number): Promise<UserDto>{
        const user = await this._userService.get(id);
        return user;
    }

    @Get()
    async getUsers(): Promise<UserDto[]>{
        const users = await this._userService.getAll();
        return users;
    }

    @Post()
    async createUser(@Body() user: User): Promise<UserDto>{
        const createUser = await this._userService.create(user);
        return createUser;
    }

    @Patch(':id')
    async updateUser(@Param('id',ParseIntPipe) id: number,@Body() user: User){
        const updateUser = await this._userService.update(id,user);
        return updateUser;
    }

    @Delete(':id')
    async deleteUser(@Param('id',ParseIntPipe) id: number){
        await this._userService.delete(id);
        return true;
    }
}
