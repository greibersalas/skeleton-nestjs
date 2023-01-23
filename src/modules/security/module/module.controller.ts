import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';

import { ModuleDto } from './dto/module.dto';
import { Modules } from './module.entity';
import { ModuleService } from './module.service';

@UseGuards(JwtAuthGuard)
@Controller('modules')
export class ModuleController {

    constructor(private readonly _moduleService: ModuleService) { }

    @Get(':id')
    async getModule(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ModuleDto> {
        const module: Modules = await this._moduleService.get(id);
        return {
            id: module.id,
            name: module.name,
            description: module.description,
            status: module.status
        };
    }

    @Get()
    async getModules(): Promise<ModuleDto[]> {
        const modules = await this._moduleService.getAll();
        return modules.map(el => {
            let mod: ModuleDto;
            mod = {
                id: el.id,
                name: el.name,
                description: el.description,
                status: el.status
            }
            return mod;
        });
    }

    @Post()
    async createModule(
        @Body() module: Modules,
        @Request() req: any
    ): Promise<Modules> {
        module.user = req.user.id;
        return await this._moduleService.create(module);;
    }

    @Put(':id')
    async updateModule(
        @Param('id', ParseIntPipe) id: number,
        @Body() module: Modules
    ) {
        return await this._moduleService.update(id, module);
    }

    @Delete(':id')
    async deleteModule(@Param('id', ParseIntPipe) id: number) {
        await this._moduleService.delete(id);
        return true;
    }
}
