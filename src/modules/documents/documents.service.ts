import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Documents } from './documents.entity';
import { DocumentRepository } from './documents.repository';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(DocumentRepository)
        private readonly _documentRepository: DocumentRepository
    ){}

    async get(id: number): Promise<Documents>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const document = await this._documentRepository.findOne(id,{where:{state:1}});

        if(!document){
            throw new NotFoundException();
        }

        return document;
    }

    async getAll(): Promise<Documents[]>{
        const document: Documents[] = await this._documentRepository.find({where:{state:1}});
        return document;
    }

    async create(bl: Documents): Promise<Documents>{
        const saveDocument: Documents = await this._documentRepository.save(bl);
        return saveDocument;
    }

    async update(id: number, document:Documents): Promise<Documents>{
        const documentExists = await this._documentRepository.findOne(id);
        if(!documentExists){
            throw new NotFoundException();
        }
        await this._documentRepository.update(id,document);
        const updateDocument : Documents = await this._documentRepository.findOne(id);
        return updateDocument;
    }

    async delete(id: number): Promise<void>{
        const documentExists = await this._documentRepository.findOne(id);
        if(!documentExists){
            throw new NotFoundException();
        }

        await this._documentRepository.update(id,{state:0});
    }
}
