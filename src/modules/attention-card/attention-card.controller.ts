import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AttentionCard } from './attention-card.entity';
import { AttentionCardService } from './attention-card.service';

@Controller('attentioncard')
export class AttentionCardController {
    constructor(private readonly _attentionCardService: AttentionCardService){}

    @Get('history/:id')
    async getByClinicHistory(@Param('id',ParseIntPipe) id: number): Promise<AttentionCard>{
        const attentionCard = await this._attentionCardService.getByClinicHistory(id);
        return attentionCard;
    }

    @Get(':id')
    async getAttentionCard(@Param('id',ParseIntPipe) id: number): Promise<AttentionCard>{
        const attentionCard = await this._attentionCardService.get(id);
        return attentionCard;
    }

    @Get()
    async getAttentionCards(): Promise<AttentionCard[]>{
        const attentionCard = await this._attentionCardService.getAll();
        return attentionCard;
    }

    @Post()
    async createAttentionCard(@Body() attentionCard: AttentionCard): Promise<AttentionCard>{
        const create = await this._attentionCardService.create(attentionCard);
        return create;
    }

    @Put(':id')
    async updateAttentionCard(@Param('id',ParseIntPipe) id: number, @Body() attentionCard: AttentionCard){
        const update = await this._attentionCardService.update(id,attentionCard);
        return update;
    }

    @Delete(':id')
    async deleteAttentionCard(@Param('id',ParseIntPipe) id: number){
        await this._attentionCardService.delete(id);
        return true;
    }
}
