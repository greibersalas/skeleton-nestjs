import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Campus } from './campus.entity';
import { CampusService } from './campus.service';

@Controller('campus')
export class CampusController {
    constructor(private readonly _campusService: CampusService){}

    @Get(':id')
    async getCampus(@Param('id',ParseIntPipe) id: number): Promise<Campus>{
        const campus = await this._campusService.get(id);
        return campus;
    }

    @Get()
    async getCampuss(): Promise<Campus[]>{
        const campus = await this._campusService.getAll();
        return campus;
    }

    @Post()
    async createCampus(@Body() campus: Campus): Promise<Campus>{
        const create = await this._campusService.create(campus);
        return create;
    }

    @Put(':id')
    async updateCampus(@Param('id',ParseIntPipe) id: number, @Body() campus: Campus){
        const update = await this._campusService.update(id,campus);
        return update;
    }

    @Delete(':id')
    async deleteCampus(@Param('id',ParseIntPipe) id: number){
        await this._campusService.delete(id);
        return true;
    }
}
