import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MouthBreathingController } from './mouth-breathing.controller';
import { MouthBreathingRepository } from './mouth-breathing.repository';
import { MouthBreathingService } from './mouth-breathing.service';

@Module({
  imports: [ TypeOrmModule.forFeature([MouthBreathingRepository])],
  controllers: [MouthBreathingController],
  providers: [MouthBreathingService]
})
export class MouthBreathingModule {}
