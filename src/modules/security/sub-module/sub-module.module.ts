import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modules } from '../module/module.entity';
import { ModuleService } from '../module/module.service';
import { SubModules } from './entity/sub-module.entity';
import { SubModuleController } from './sub-module.controller';
import { SubModuleService } from './sub-module.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubModules, Modules])],
  controllers: [SubModuleController],
  providers: [SubModuleService, ModuleService]
})
export class SubModuleModule { }
