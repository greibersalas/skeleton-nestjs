import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Documents } from './documents.entity';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {

    constructor(private readonly _documentService: DocumentsService){}

    @Get(':id')
    async getDocuments(@Param('id',ParseIntPipe) id: number): Promise<Documents>{
        const document = await this._documentService.get(id);
        return document;
    }

    @Get()
    async getDocumentss(): Promise<Documents[]>{
        const document = await this._documentService.getAll();
        return document;
    }

    @Post()
    async createDocuments(@Body() document: Documents): Promise<Documents>{
        const create = await this._documentService.create(document);
        return create;
    }

    @Put(':id')
    async updateDocuments(@Param('id',ParseIntPipe) id: number, @Body() document: Documents){
        const update = await this._documentService.update(id,document);
        return update;
    }

    @Delete(':id')
    async deleteDocuments(@Param('id',ParseIntPipe) id: number){
        await this._documentService.delete(id);
        return true;
    }
}
