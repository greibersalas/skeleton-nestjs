import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicHistoryRepository } from '../clinic-history/clinic-history.repository';
import { AttentionCardController } from './attention-card.controller';
import { AttentionCardRepository } from './attention-card.repository';
import { AttentionCardService } from './attention-card.service';

@Module({
  imports: [ TypeOrmModule.forFeature([AttentionCardRepository,ClinicHistoryRepository])],
  controllers: [AttentionCardController],
  providers: [AttentionCardService]
})
export class AttentionCardModule {}