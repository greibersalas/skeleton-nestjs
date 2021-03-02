import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService){}

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUser(@Param('id',ParseIntPipe) id: number): Promise<User>{
        const user = await this._userService.get(id);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUsers(): Promise<User[]>{
        const users = await this._userService.getAll();
        return users;
    }

    @Post()
    async createUser(@Body() user: User): Promise<User>{
        const createUser = await this._userService.create(user);
        return createUser;
    }

    @Put(':id')
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
