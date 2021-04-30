import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MasterPermissions } from './master-permissions.entity';
import { MasterPermissionsService } from './master-permissions.service';

@Controller('masterpermissions')
export class MasterPermissionsController {
    constructor(private readonly _masterpermissionsService: MasterPermissionsService){}

    @Get(':id')
    async getMasterPermissions(@Param('id',ParseIntPipe) id: number): Promise<MasterPermissions>{
        const masterpermissions = await this._masterpermissionsService.get(id);
        return masterpermissions;
    }

    @Get()
    async getMasterPermissionsAll(): Promise<MasterPermissions[]>{
        const permissions = await this._masterpermissionsService.getAll();
        return permissions;
    }

    @Post()
    async createMasterPermissions(@Body() masterpermissions: MasterPermissions): Promise<MasterPermissions>{
        const createMasterPermissions = await this._masterpermissionsService.create(masterpermissions);
        return createMasterPermissions;
    }

    @Patch(':id')
    async updateMasterPermissions(@Param('id',ParseIntPipe) id: number,@Body() masterpermissions: MasterPermissions){
        const updateMasterPermissions = await this._masterpermissionsService.update(id,masterpermissions);
        return updateMasterPermissions;
    }

    @Delete(':id')
    async deleteMasterPermissions(@Param('id',ParseIntPipe) id: number){
        await this._masterpermissionsService.delete(id);
        return true;
    }
}
