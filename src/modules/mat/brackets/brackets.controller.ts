import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Brackets } from './brackets.entity';
import { BracketsService } from './brackets.service';

@Controller('brackets')
export class BracketsController {
    constructor(private readonly _bracketsService: BracketsService){}

    @Get(':id')
    async getBraket(@Param('id',ParseIntPipe) id: number): Promise<Brackets>{
        const brackets = await this._bracketsService.get(id);
        return brackets;
    }

    @Get()
    async getBrackets(): Promise<Brackets[]>{
        const brackets = await this._bracketsService.getAll();
        return brackets;
    }

    @Post()
    async createBrackets(@Body() brackets: Brackets): Promise<Brackets>{
        const create = await this._bracketsService.create(brackets);
        return create;
    }

    @Put(':id')
    async updateBrackets(@Param('id',ParseIntPipe) id: number, @Body() brackets: Brackets){
        const update = await this._bracketsService.update(id,brackets);
        return update;
    }

    @Delete(':id')
    async deleteBrackets(@Param('id',ParseIntPipe) id: number){
        await this._bracketsService.delete(id);
        return true;
    }
}
