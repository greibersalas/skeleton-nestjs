import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Districts } from './districts.entity';
import { DistrictsService } from './districts.service';

@Controller('districts')
export class DistrictsController {
    constructor(private readonly _DistrictsService: DistrictsService){}

    @Get(':id')
    async getDistricts(@Param('id',ParseIntPipe) id: number): Promise<Districts>{
        const Districts = await this._DistrictsService.get(id);
        return Districts;
    }

    @Get()
    async getDistrictss(): Promise<Districts[]>{
        const Districts = await this._DistrictsService.getAll();
        return Districts;
    }

    @Post()
    async createDistricts(@Body() Districts: Districts): Promise<Districts>{
        const create = await this._DistrictsService.create(Districts);
        return create;
    }

    @Put(':id')
    async updateDistricts(@Param('id',ParseIntPipe) id: number, @Body() Districts: Districts){
        const update = await this._DistrictsService.update(id,Districts);
        return update;
    }

    @Delete(':id')
    async deleteDistricts(@Param('id',ParseIntPipe) id: number){
        await this._DistrictsService.delete(id);
        return true;
    }
}
