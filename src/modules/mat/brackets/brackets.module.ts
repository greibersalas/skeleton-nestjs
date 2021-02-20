import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BracketsController } from './brackets.controller';
import { BracketsRepository } from './brackets.repository';
import { BracketsService } from './brackets.service';

@Module({
  imports: [ TypeOrmModule.forFeature([BracketsRepository])],
  controllers: [BracketsController],
  providers: [BracketsService]
})
export class BracketsModule {}
