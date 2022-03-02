import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { Permissions } from './permissions.entity';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly _permissionsService: PermissionsService){}

    @Get(':id')
    async getPermissions(@Param('id',ParseIntPipe) id: number): Promise<Permissions>{
        const permissions = await this._permissionsService.get(id);
        return permissions;
    }

    @Get("/user/:user")
    async getPermissionss(@Param('user',ParseIntPipe) user: number): Promise<Permissions[]>{
        const permissions = await this._permissionsService.getByUser(user);
        return permissions;
    }

    @Post()
    async createPermissions(@Body() permissions: Permissions): Promise<Permissions>{
        const createPermissions = await this._permissionsService.create(permissions);
        return createPermissions;
    }

    @Put(':id')
    async updatePermissions(@Param('id',ParseIntPipe) id: number,@Body() permissions: Permissions){
        const updatePermissions = await this._permissionsService.update(id,permissions);
        return updatePermissions;
    }

    @Delete(':id')
    async deletePermissions(@Param('id',ParseIntPipe) id: number){
        await this._permissionsService.delete(id);
        return true;
    }
}
