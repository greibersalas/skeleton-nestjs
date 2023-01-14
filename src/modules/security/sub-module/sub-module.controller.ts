import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';

import { SubModuleDto } from './dto/sub-module-dto';
import { SubModules } from './entity/sub-module.entity';
import { SubModuleService } from './sub-module.service';

@UseGuards(JwtAuthGuard)
@Controller('sub-module')
export class SubModuleController {

    constructor(private readonly service: SubModuleService) { }

    @Get(':id')
    async getModule(
        @Param('id', ParseIntPipe) id: number
    ): Promise<SubModuleDto> {
        const module: SubModules = await this.service.get(id);
        return {
            id: module.id,
            title: module.title,
            description: module.description,
            status: module.status,
            module: module.module.id,
            module_name: module.module.name,
            code: module.code,
            icon: module.icon,
            type: module.type,
            target: module.target,
            breadcrumbs: module.breadcrumbs
        };
    }

    @Get()
    async getModules(): Promise<SubModuleDto[]> {
        const modules = await this.service.getAll();
        return modules.map(el => {
            let mod: SubModuleDto;
            mod = {
                id: el.id,
                title: el.title,
                description: el.description,
                status: el.status,
                module: el.module.id,
                module_name: el.module.name,
                code: el.code,
                icon: el.icon,
                type: el.type,
                target: el.target,
                breadcrumbs: el.breadcrumbs
            }
            return mod;
        });
    }

    @Get('sub-modules/:idmodule')
    async getSubModules(
        @Param('idmodule', ParseIntPipe) idmodule: number
    ): Promise<SubModuleDto[]> {
        const modules = await this.service.getSubModules(idmodule);
        return modules.map(el => {
            let mod: SubModuleDto;
            mod = {
                id: el.id,
                title: el.title,
                description: el.description,
                status: el.status,
                module: el.module.id,
                module_name: el.module.name,
                code: el.code,
                icon: el.icon,
                type: el.type,
                target: el.target,
                breadcrumbs: el.breadcrumbs
            }
            return mod;
        });
    }

    @Post()
    async createModule(
        @Body() module: SubModules,
        @Request() req: any
    ): Promise<SubModules> {
        module.user = req.user.id;
        return await this.service.create(module);
    }

    @Put(':id')
    async updateModule(
        @Param('id', ParseIntPipe) id: number,
        @Body() module: SubModules
    ) {
        return await this.service.update(id, module);
    }

    @Delete(':id')
    async deleteModule(@Param('id', ParseIntPipe) id: number) {
        await this.service.delete(id);
        return true;
    }
}
