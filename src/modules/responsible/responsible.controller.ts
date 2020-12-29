import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Responsible } from './responsible.entity';
import { ResponsibleService } from './responsible.service';

@Controller('responsible')
export class ResponsibleController {
    constructor(private readonly _ResponsibleService: ResponsibleService){}

    @Get(':id')
    async getResponsible(@Param('id',ParseIntPipe) id: number): Promise<Responsible>{
        const Responsible = await this._ResponsibleService.get(id);
        return Responsible;
    }

    @Get()
    async getResponsibles(): Promise<Responsible[]>{
        const Responsible = await this._ResponsibleService.getAll();
        return Responsible;
    }

    @Post()
    async createResponsible(@Body() Responsible: Responsible): Promise<Responsible>{
        const create = await this._ResponsibleService.create(Responsible);
        return create;
    }

    @Put(':id')
    async updateResponsible(@Param('id',ParseIntPipe) id: number, @Body() Responsible: Responsible){
        const update = await this._ResponsibleService.update(id,Responsible);
        return update;
    }

    @Delete(':id')
    async deleteResponsible(@Param('id',ParseIntPipe) id: number){
        await this._ResponsibleService.delete(id);
        return true;
    }
}

