import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModuleController } from './module.controller';
import { Modules } from './module.entity';
import { ModuleService } from './module.service';

@Module({
  imports: [TypeOrmModule.forFeature([Modules])],
  controllers: [ModuleController],
  providers: [ModuleService]
})
export class ModuleModule { }
