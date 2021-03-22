import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { MedicalActAttention } from './medical-act-attention.entity';
import { MedicalActAttentionService } from './medical-act-attention.service';

@Controller('medical-act-attention')
export class MedicalActAttentionController {

    constructor(private readonly _medicalActAttentionService: MedicalActAttentionService){}

    @Get(':id')
    async getMedicalActAttention(@Param('id',ParseIntPipe) id: number): Promise<MedicalActAttention>{
        const medicalActAttention = await this._medicalActAttentionService.get(id);
        return medicalActAttention;
    }

    @Get()
    async getMedicalActAttentions(): Promise<MedicalActAttention[]>{
        const medicalActAttention = await this._medicalActAttentionService.getAll();
        return medicalActAttention;
    }

    @Post()
    async createMedicalActAttention(@Body() medicalActAttention: MedicalActAttention): Promise<MedicalActAttention>{
        const create = await this._medicalActAttentionService.create(medicalActAttention);
        return create;
    }

    @Put(':id')
    async updateMedicalActAttention(@Param('id',ParseIntPipe) id: number, @Body() medicalActAttention: MedicalActAttention){
        const update = await this._medicalActAttentionService.update(id,medicalActAttention);
        return update;
    }

    @Delete(':id')
    async deleteMedicalActAttention(@Param('id',ParseIntPipe) id: number){
        await this._medicalActAttentionService.delete(id);
        return true;
    }

    @Get('by-medical-act/:id')
    async getByMedicalAct(@Param('id',ParseIntPipe) id: number): Promise<MedicalActAttention[]>{
        const medicalActAttention = await this._medicalActAttentionService.getByMedicalAct(id);
        return medicalActAttention;
    }
}
