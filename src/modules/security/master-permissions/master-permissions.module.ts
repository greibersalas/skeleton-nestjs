import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterPermissionsController } from './master-permissions.controller';
import { MasterPermissionsRepository } from './master-permissions.repository';
import { MasterPermissionsService } from './master-permissions.service';

@Module({
    imports: [TypeOrmModule.forFeature([MasterPermissionsRepository])],
    providers: [MasterPermissionsService],
    controllers: [MasterPermissionsController]
})
export class MasterPermissionsModule {}
