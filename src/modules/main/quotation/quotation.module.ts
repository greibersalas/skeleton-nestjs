import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuotationRepository } from './quotation.repository';
import { QuotationDetailRepository } from './quotation-detail.repository';
import { QuotationTermsRepository } from '../quotation-terms/quotation-terms.repository';
import { OdontogramaRepository } from '../odontograma/odontograma.repository';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuotationRepository,
      QuotationDetailRepository,
      OdontogramaRepository,
      QuotationTermsRepository
    ])
  ],
  controllers: [QuotationController],
  providers: [QuotationService]
})
export class QuotationModule {}
