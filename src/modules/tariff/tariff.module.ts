import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TariffHistoryRepository } from './tariff-history.repository';
import { TariffController } from './tariff.controller';
import { TariffRepository } from './tariff.repository';
import { TariffService } from './tariff.service';

@Module({
  imports: [TypeOrmModule.forFeature([TariffRepository,TariffHistoryRepository])],
  controllers: [TariffController],
  providers: [TariffService]
})
export class TariffModule {}
