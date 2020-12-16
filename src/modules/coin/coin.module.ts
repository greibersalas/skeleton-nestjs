import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinController } from './coin.controller';
import { CoinRepository } from './coin.repository';
import { CoinService } from './coin.service';

@Module({
  imports: [ TypeOrmModule.forFeature([CoinRepository])],
  controllers: [CoinController],
  providers: [CoinService]
})
export class CoinModule {}

