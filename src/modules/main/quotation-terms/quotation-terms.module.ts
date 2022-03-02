import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuotationTermsController } from './quotation-terms.controller';
import { QuotationTermsRepository } from './quotation-terms.repository';
import { QuotationTermsService } from './quotation-terms.service';

@Module({
  imports: [ TypeOrmModule.forFeature([QuotationTermsRepository])],
  controllers: [QuotationTermsController],
  providers: [QuotationTermsService]
})
export class QuotationTermsModule {}
