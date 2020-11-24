import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Specialty } from './specialty.entity';
import { SpecialtyService } from './specialty.service';

@Controller('specialty')
export class SpecialtyController {

    constructor(private readonly _specialtyService: SpecialtyService){}

    @Get(':id')
    async getSpecialty(@Param('id',ParseIntPipe) id: number): Promise<Specialty>{
        const specialty = await this._specialtyService.get(id);
        return specialty;
    }

    @Get()
    async getSpecialtys(): Promise<Specialty[]>{
        const specialty = await this._specialtyService.getAll();
        return specialty;
    }

    @Post()
    async createSpecialty(@Body() specialty: Specialty): Promise<Specialty>{
        const create = await this._specialtyService.create(specialty);
        return create;
    }

    @Put(':id')
    async updateSpecialty(@Param('id',ParseIntPipe) id: number, @Body() specialty: Specialty){
        const update = await this._specialtyService.update(id,specialty);
        return update;
    }

    @Delete(':id')
    async deleteSpecialty(@Param('id',ParseIntPipe) id: number){
        await this._specialtyService.delete(id);
        return true;
    }
}
