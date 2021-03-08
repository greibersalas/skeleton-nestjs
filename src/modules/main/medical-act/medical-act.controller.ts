import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

import { editFileName, imageFileFilter } from '../../../utils/file-upload.utils';
import { MedicalAct } from './medical-act.entity';
import { MedicalActService } from './medical-act.service';
import { MedicalActFileGroup } from './medical-act-file-group.entity';
import { MedicalActFiles } from './medical-act-files.entity';

@Controller('medical-act')
export class MedicalActController {

    constructor(private readonly _medicalActService: MedicalActService){}

    @Get(':id')
    async getMedicalAct(@Param('id',ParseIntPipe) id: number): Promise<MedicalAct>{
        const medicalAct = await this._medicalActService.get(id);
        return medicalAct;
    }

    @Get()
    async getMedicalActs(): Promise<MedicalAct[]>{
        const medicalAct = await this._medicalActService.getAll();
        return medicalAct;
    }

    @Post()
    async createMedicalAct(@Body() medicalAct: MedicalAct): Promise<MedicalAct>{
        const create = await this._medicalActService.create(medicalAct);
        return create;
    }

    @Put(':id')
    async updateMedicalAct(@Param('id',ParseIntPipe) id: number, @Body() medicalAct: MedicalAct){
        const update = await this._medicalActService.update(id,medicalAct);
        return update;
    }

    @Delete(':id')
    async deleteMedicalAct(@Param('id',ParseIntPipe) id: number){
        await this._medicalActService.delete(id);
        return true;
    }

    @Get('get-by-reservation/:id')
    async getFirst(@Param('id') id): Promise<MedicalAct>{
        return await this._medicalActService.getByReservation(id);
    }

    @Post("upload/:group/:id")
    //@UseInterceptors(FileInterceptor("file",{dest:"./uploads"}))
    @UseInterceptors(
        FileInterceptor('file',{
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadFile(@UploadedFile() file,@Param('group',ParseIntPipe) group: number,
    @Param('id',ParseIntPipe) id: number,@Body() des: any){
        
        const response = {
            originalname: file.originalname,
            filename: file.filename,
            fileext: extname(file.originalname)
        };
        //Data a guadar en la tabla
        const data = {
            fila_name: file.filename,
            file_ext: extname(file.originalname),
            medicalact: id,
            filegroup: group,
            desciption: des.description
        };
        await this._medicalActService.addFiles(data);
        return {
            status: HttpStatus.OK,
            message: 'Image uploaded successfully!',
            data: response
        };
    }

    @Get('get-file/:file')
    getFile(@Param('file') file, @Res() res){
        const response = res.sendFile(file,{root: './uploads'});
        return {
            status: HttpStatus.OK,
            data: response
        }
    }

    /**GROUP FILES */
    @Get('groups/all')
    async getMedicalActFileGroups(): Promise<MedicalActFileGroup[]>{
        const data = await this._medicalActService.getAllGroup();
        return data;
    }

    @Post('group')
    async createGroup(@Body() medicalActFileGroup: MedicalActFileGroup): Promise<MedicalActFileGroup>{
        const create = await this._medicalActService.createGroup(medicalActFileGroup);
        return create;
    }

    @Put('group/:id')
    async updateGroup(@Param('id',ParseIntPipe) id: number, @Body() data: MedicalActFileGroup){
        const update = await this._medicalActService.updateGroup(id,data);
        return update;
    }

    @Get('get-files-clinichistory/:id')
    async getFilesClinicHistory(@Param('id') id): Promise<MedicalActFiles[]>{
        return await this._medicalActService.getFilesByClinicHistory(id);
    }

    @Get('get-files-medical-act/:id')
    async getFilesMedicalAct(@Param('id') id): Promise<MedicalActFiles[]>{
        return await this._medicalActService.getFilesByMedicalAct(id);
    }

    @Get('get-by-clinic-history/:id')
    async getMedicalActClinicHistory(@Param('id',ParseIntPipe) id: number): Promise<any[]>{
        return await this._medicalActService.getByClinicHistory(id);
    }
}
