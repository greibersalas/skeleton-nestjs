import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModuleRepository } from '../module/module.repository';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleRepository])],
  controllers: [ModuleController],
  providers: [ModuleService]
})
export class ModuleModule {}
