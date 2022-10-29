import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicalActAttentionRepository } from 'src/modules/main/medical-act-attention/medical-act-attention.repository';
import { ErpController } from './erp.controller';
import { ErpService } from './erp.service';

@Module({
    imports: [TypeOrmModule.forFeature([MedicalActAttentionRepository])],
    controllers: [ErpController],
    providers: [ErpService]
})
export class ErpModule {}
