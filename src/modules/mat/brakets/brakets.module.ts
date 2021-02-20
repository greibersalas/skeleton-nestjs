import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BraketsController } from './brakets.controller';
import { BraketsRepository } from './brakets.repository';
import { BraketsService } from './brakets.service';

@Module({
  imports: [ TypeOrmModule.forFeature([BraketsRepository])],
  controllers: [BraketsController],
  providers: [BraketsService]
})
export class BraketsModule {}
