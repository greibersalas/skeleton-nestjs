import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
var moment = require('moment-timezone');
//Entities
import { Audit } from '../security/audit/audit.entity';
import { User } from './user.entity';
//Services
import { UserService } from './user.service';
//Guard
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService) { }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this._userService.get(id);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUsers(): Promise<User[]> {
        const users = await this._userService.getAll();
        return users;
    }

    @Post()
    async createUser(@Body() user: User): Promise<User> {
        const createUser = await this._userService.create(user);
        return createUser;
    }

    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
        const updateUser = await this._userService.update(id, user);
        return updateUser;
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        await this._userService.delete(id);
        return true;
    }

    @Delete('change-state/:id/:state')
    async changeStateUser(
        @Param('id', ParseIntPipe) id: number,
        @Param('state', ParseIntPipe) state: number,
        @Request() req: any
    ) {
        const updateUser = await this._userService.changeState(id, state);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'user';
        audit.description = 'Change State';
        audit.data = JSON.stringify({ state });
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return updateUser;
    }

    @Post('/autorization')
    async AutorizationAction(
        @Body() body: any
    ): Promise<User> {
        const { password, data, module } = body;
        const user = await this._userService.autorizationUser(password);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = data.id;
        audit.title = module;
        audit.description = 'Autorización';
        audit.data = JSON.stringify({ data });
        audit.iduser = Number(user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        return user;
    }
}
