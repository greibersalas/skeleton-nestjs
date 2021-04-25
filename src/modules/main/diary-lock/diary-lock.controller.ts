import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { DiaryLock } from './diary-lock.entity';
import { DiaryLockService } from './diary-lock.service';

@Controller('diary-lock')
export class DiaryLockController {

    constructor(private readonly _diaryLockService: DiaryLockService){}

    @Get(':id')
    async getBraket(@Param('id',ParseIntPipe) id: number): Promise<DiaryLock>{
        const diaryLock = await this._diaryLockService.get(id);
        return diaryLock;
    }

    @Get()
    async getDiaryLock(): Promise<DiaryLock[]>{
        const diaryLock = await this._diaryLockService.getAll();
        return diaryLock;
    }

    @Post()
    async createDiaryLock(@Body() diaryLock: DiaryLock): Promise<DiaryLock>{
        const create = await this._diaryLockService.create(diaryLock);
        return create;
    }

    @Put(':id')
    async updateDiaryLock(@Param('id',ParseIntPipe) id: number, @Body() diaryLock: DiaryLock){
        const update = await this._diaryLockService.update(id,diaryLock);
        return update;
    }

    @Delete(':id')
    async deleteDiaryLock(@Param('id',ParseIntPipe) id: number){
        await this._diaryLockService.delete(id);
        return true;
    }

}
