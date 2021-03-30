import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { ModuleDto } from './dto/module.dto';
import { Module } from './module.entity';
import { ModuleService } from './module.service';

@Controller('module')
export class ModuleController {

    constructor(private readonly _moduleService: ModuleService){}

    @Get(':id')
    async getModule(@Param('id',ParseIntPipe) id: number): Promise<Module>{
        const module = await this._moduleService.get(id);
        return module;
    }

    @Get()
    async getModules(): Promise<ModuleDto[]>{
        const modules = await this._moduleService.getAll();
        return modules;
    }

    @Post()
    async createModule(@Body() module: ModuleDto): Promise<ModuleDto>{
        return await this._moduleService.create(module);;
    }

    @Put(':id')
    async updateModule(@Param('id',ParseIntPipe) id: number,@Body() module: ModuleDto){
        return await this._moduleService.update(id,module);
    }

    @Delete(':id')
    async deleteModule(@Param('id',ParseIntPipe) id: number){
        await this._moduleService.delete(id);
        return true;
    }
}
