import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicalActAttentionController } from './medical-act-attention.controller';
import { MedicalActAttentionRepository } from './medical-act-attention.repository';
import { MedicalActAttentionService } from './medical-act-attention.service';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalActAttentionRepository])],
  controllers: [MedicalActAttentionController],
  providers: [MedicalActAttentionService]
})
export class MedicalActAttentionModule {}
