import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
import { InsertResult } from 'typeorm';

import { ModulesPermissionsDto } from './dto/module-permissions-dto';
import { NavigationItemDto } from './dto/modules-navigation-dto';
import { ModulesUserDto } from './dto/modules-user-dto';
import { PermissionsMultiModules } from './dto/permissions-multimodules-dto';
import { ModulesPermissions } from './entity/module-user.entity';
import { ModulesUserService } from './modules-user.service';

@UseGuards(JwtAuthGuard)
@Controller('modules-user')
export class ModulesUserController {

    constructor(private readonly service: ModulesUserService) { }

    @Post('/multi-permissions')
    async insertMultiPermissions(
        @Body() module: PermissionsMultiModules,
        @Request() req: any
    ): Promise<boolean> {
        const user = req.user.id;
        return await this.service.insertMultiPermissions(module, Number(user));
    }

    @Post()
    async createModule(
        @Body() module: ModulesPermissions,
        @Request() req: any
    ): Promise<ModulesPermissions> {
        module.user = req.user.id;
        return await this.service.create(module);
    }

    @Put(':id')
    async updateModule(
        @Param('id', ParseIntPipe) id: number,
        @Body() module: ModulesPermissions
    ) {
        return await this.service.update(id, module);
    }

    @Delete(':id')
    async deleteModule(@Param('id', ParseIntPipe) id: number) {
        await this.service.delete(id);
        return true;
    }

    @Get('get-modules/user')
    async getModulesUser(@Request() req: any): Promise<ModulesUserDto[]> {
        return await this.service.getModulesUser(Number(req.user.id));
    }

    @Get('get-modules/user/:iduser')
    async getModulesUserById(@Param('iduser', ParseIntPipe) iduser: number): Promise<ModulesUserDto[]> {
        return await this.service.getModulesUser(iduser);
    }

    @Get('get-submodules/user/:idmodule')
    async getSubModulesUser(
        @Param('idmodule', ParseIntPipe) idmodule: number,
        @Request() req: any
    ): Promise<NavigationItemDto[]> {
        const data = await this.service.getSubModules(Number(req.user.id), idmodule);
        // Busco los padres
        const listfathers: NavigationItemDto[] = [{
            id: -1,
            title: 'Navigation',
            type: 'group',
            icon: 'feather icon-monitor',
            children: [
                {
                    id: -2,
                    title: 'Inicio',
                    type: 'item',
                    icon: 'feather icon-home',
                    url: '/inicio',
                    breadcrumbs: false
                },
            ]
        }];
        data.forEach(el => {
            if (listfathers[0].children.length === 1) {
                listfathers[0].children.push({
                    id: el.idfather,
                    title: el.father,
                    type: 'collapse',
                    icon: el.icon_father,
                    children: []
                });
            }
            if (listfathers[0].children.findIndex(ele => ele.id === el.idfather) < 0) {
                listfathers[0].children.push({
                    id: el.idfather,
                    title: el.father,
                    type: 'collapse',
                    icon: el.icon_father,
                    children: []
                });
            }
        });
        listfathers[0].children.forEach(el => {
            const childrens = data.filter(ele => ele.idfather === el.id);
            childrens.forEach(item => {
                el.children.push({
                    id: item.id,
                    title: item.title,
                    type: 'item',
                    url: item.url,
                    target: false,
                    breadcrumbs: false
                });
            });
        });
        return listfathers;
    }

    @Get('get-permission-module/:code')
    async getPermissionModule(
        @Param('code') code: string,
        @Request() req: any
    ): Promise<ModulesPermissions> {
        return await this.service.getPerssionModule(code, Number(req.user.id));
    }
}
