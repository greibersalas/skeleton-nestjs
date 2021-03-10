import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnamnesisController } from './anamnesis.controller';
import { AnamnesisRepository } from './anamnesis.repository';
import { AnamnesisService } from './anamnesis.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnamnesisRepository])],
  controllers: [AnamnesisController],
  providers: [AnamnesisService]
})
export class AnamnesisModule {}
