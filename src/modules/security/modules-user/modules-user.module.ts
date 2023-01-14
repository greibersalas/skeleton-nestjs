import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubModules } from '../sub-module/entity/sub-module.entity';
import { ModulesPermissions } from './entity/module-user.entity';
import { ModulesUserController } from './modules-user.controller';
import { ModulesUserService } from './modules-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModulesPermissions, SubModules])],
  controllers: [ModulesUserController],
  providers: [ModulesUserService]
})
export class ModulesUserModule { }
