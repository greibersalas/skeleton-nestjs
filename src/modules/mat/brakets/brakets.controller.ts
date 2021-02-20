import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Brakets } from './brakets.entity';
import { BraketsService } from './brakets.service';

@Controller('brakets')
export class BraketsController {
    constructor(private readonly _braketsService: BraketsService){}

    @Get(':id')
    async getBraket(@Param('id',ParseIntPipe) id: number): Promise<Brakets>{
        const brakets = await this._braketsService.get(id);
        return brakets;
    }

    @Get()
    async getBrakets(): Promise<Brakets[]>{
        const brakets = await this._braketsService.getAll();
        return brakets;
    }

    @Post()
    async createBrakets(@Body() brakets: Brakets): Promise<Brakets>{
        const create = await this._braketsService.create(brakets);
        return create;
    }

    @Put(':id')
    async updateBrakets(@Param('id',ParseIntPipe) id: number, @Body() brakets: Brakets){
        const update = await this._braketsService.update(id,brakets);
        return update;
    }

    @Delete(':id')
    async deleteBrakets(@Param('id',ParseIntPipe) id: number){
        await this._braketsService.delete(id);
        return true;
    }
}
