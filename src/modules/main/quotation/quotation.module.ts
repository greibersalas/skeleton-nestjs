import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationDetailRepository } from './quotation-detail.repository';
import { QuotationController } from './quotation.controller';
import { QuotationRepository } from './quotation.repository';
import { QuotationService } from './quotation.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuotationRepository,QuotationDetailRepository])],
  controllers: [QuotationController],
  providers: [QuotationService]
})
export class QuotationModule {}
