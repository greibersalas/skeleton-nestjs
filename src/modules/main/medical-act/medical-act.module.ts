import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicalActController } from './medical-act.controller';
import { MedicalActRepository } from './medical-act.repository';
import { MedicalActService } from './medical-act.service';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalActRepository])],
  controllers: [MedicalActController],
  providers: [MedicalActService]
})
export class MedicalActModule {}
