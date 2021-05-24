import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { editFileName, imageFileFilter } from '../../../utils/file-upload.utils';
import { Audit } from '../../security/audit/audit.entity';
import { MedicalAct } from './medical-act.entity';
import { MedicalActService } from './medical-act.service';
import { MedicalActFileGroup } from './medical-act-file-group.entity';
import { MedicalActFiles } from './medical-act-files.entity';

@UseGuards(JwtAuthGuard)
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
    async createMedicalAct(
        @Body() medicalAct: MedicalAct,
        @Request() req: any
    ): Promise<MedicalAct>{
        const create = await this._medicalActService.create(medicalAct);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'medical-act';
        audit.description = 'Insertar registro';
        audit.data = JSON.stringify(create);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return create;
    }

    @Put(':id')
    async updateMedicalAct(
        @Param('id',ParseIntPipe) id: number,
        @Body() medicalAct: MedicalAct,
        @Request() req: any
    ){
        const update = await this._medicalActService.update(id,medicalAct);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'medical-act';
        audit.description = 'Update registro';
        audit.data = JSON.stringify(update);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    @Delete(':id')
    async deleteMedicalAct(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._medicalActService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'medical-act';
        audit.description = 'Delete registro';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return true;
    }

    @Get('get-by-reservation/:id')
    async getFirst(@Param('id', ParseIntPipe) id: number): Promise<MedicalAct>{
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
    async uploadFile(
        @UploadedFile() file: any,
        @Param('group',ParseIntPipe) group: number,
        @Param('id',ParseIntPipe) id: number,
        @Body() des: any,
        @Request() req: any
    ){
        const response = {
            originalname: file.originalname,
            filename: file.filename,
            fileext: extname(file.originalname)
        };
        //Data a guadar en la tabla
        const data = {
            fila_name: file.filename,
            file_ext: extname(file.originalname),
            clinichistory : null,
            medicalact: id,
            filegroup: group,
            desciption: des.description
        };
        const fileinsert = await this._medicalActService.addFiles(data);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = fileinsert.id;
        audit.title = 'medical-act-file';
        audit.description = 'Insertar registro';
        audit.data = JSON.stringify(fileinsert);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return {
            status: HttpStatus.OK,
            message: 'Image uploaded successfully!',
            data: response
        };
    }

    @Post("upload/hc/:group/:id")
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
    async uploadFileFromHC(
        @UploadedFile() file: any,
        @Param('group',ParseIntPipe) group: number,
        @Param('id',ParseIntPipe) id: number,
        @Body() des: any,
        @Request() req: any
    ){
        const response = {
            originalname: file.originalname,
            filename: file.filename,
            fileext: extname(file.originalname)
        };
        //Data a guadar en la tabla
        const data = {
            fila_name: file.filename,
            file_ext: extname(file.originalname),
            clinichistory : id,
            medicalact:null,
            filegroup: group,
            desciption: des.description
        };
        const fileinsert = await this._medicalActService.addFiles(data);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = fileinsert.id;
        audit.title = 'clinic-history-file';
        audit.description = 'Insertar registro';
        audit.data = JSON.stringify(fileinsert);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return {
            status: HttpStatus.OK,
            message: 'Image uploaded successfully!',
            data: response
        };
    }

    

    @Get('get-file/:file')
    getFile(@Param('file') file: any, @Res() res: any){
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
    async createGroup(
        @Body() medicalActFileGroup: MedicalActFileGroup,
        @Request() req: any
    ): Promise<MedicalActFileGroup>{
        const create = await this._medicalActService.createGroup(medicalActFileGroup);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'group-file';
        audit.description = 'Insertar registro';
        audit.data = JSON.stringify(create);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return create;
    }

    @Put('group/:id')
    async updateGroup(
        @Param('id',ParseIntPipe) id: number,
        @Body() data: MedicalActFileGroup,
        @Request() req: any
    ){
        const update = await this._medicalActService.updateGroup(id,data);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'group-file';
        audit.description = 'Update registro';
        audit.data = JSON.stringify(update);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
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
