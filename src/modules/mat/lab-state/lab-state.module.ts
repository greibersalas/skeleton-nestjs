import { Module } from '@nestjs/common';
import { LabStateService } from './lab-state.service';
import { LabStateController } from './lab-state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabStateRepository } from './lab-state.repository';

@Module({
  imports: [ TypeOrmModule.forFeature([LabStateRepository])],
  providers: [LabStateService],
  controllers: [LabStateController]
})
export class LabStateModule {}
