import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MasterPermissionsDto } from './dto/master-permissions-dto';
import { MasterPermissions } from './master-permissions.entity';
import { MasterPermissionsService } from './master-permissions.service';

@Controller('masterpermissions')
export class MasterPermissionsController {
    constructor(private readonly _masterpermissionsService: MasterPermissionsService) { }

    @Get(':id')
    async getMasterPermissions(
        @Param('id', ParseIntPipe) id: number
    ): Promise<MasterPermissions> {
        return await this._masterpermissionsService.get(id);
    }

    @Get()
    async getMasterPermissionsAll(): Promise<MasterPermissionsDto[]> {
        const data = await this._masterpermissionsService.getAll();
        return data.map(el => {
            let item: MasterPermissionsDto = {
                id: el.id,
                page: el.page,
                description: el.description,
                estado: el.estado,
                idmodule: el.module.id,
                module: el.module.name
            }
            return item;
        });
    }

    @Get('/get/not-user/:iduser')
    async getMasterPermissionsNotUser(
        @Param('iduser', ParseIntPipe) iduser: number
    ): Promise<MasterPermissions[]> {
        return await this._masterpermissionsService.getNotUser(iduser);
    }

    @Post()
    async createMasterPermissions(
        @Body() masterpermissions: MasterPermissions
    ): Promise<MasterPermissions> {
        return await this._masterpermissionsService.create(masterpermissions);
    }

    @Patch(':id')
    async updateMasterPermissions(
        @Param('id', ParseIntPipe) id: number,
        @Body() masterpermissions: MasterPermissions
    ) {
        return await this._masterpermissionsService.update(id, masterpermissions);
    }

    @Delete(':id')
    async deleteMasterPermissions(
        @Param('id', ParseIntPipe) id: number
    ) {
        await this._masterpermissionsService.delete(id);
        return true;
    }
}
