import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditRepository } from 'src/modules/security/audit/audit.repository';

import { DiaryLockController } from './diary-lock.controller';
import { DiaryLockRepository } from './diary-lock.repository';
import { DiaryLockService } from './diary-lock.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryLockRepository, AuditRepository])],
  controllers: [DiaryLockController],
  providers: [DiaryLockService]
})
export class DiaryLockModule {}
