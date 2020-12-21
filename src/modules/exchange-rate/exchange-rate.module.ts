import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRateRepository } from './exchange-rate.repository';
import { ExchangeRateService } from './exchange-rate.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ExchangeRateRepository])],
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService]
})
export class ExchangeRateModule {}
