import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsService } from './permissions.service';

@Module({
    imports: [TypeOrmModule.forFeature([PermissionsRepository])],
    providers: [PermissionsService],
    controllers: [PermissionsController]
})
export class PermissionsModule {}
