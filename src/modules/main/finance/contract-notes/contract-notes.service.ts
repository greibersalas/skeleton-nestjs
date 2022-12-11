import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
const moment = require('moment-timezone');
import { Repository } from 'typeorm';
import { ContractNotesDto } from './dto/contract-notes-dto';
import { ContractNotes } from './entity/contract-notes.entity';

@Injectable()
export class ContractNotesService {

    constructor(
        @InjectRepository(ContractNotes)
        private readonly repository: Repository<ContractNotes>
    ) { }

    // Obtenemos todas las notas
    get(): Promise<ContractNotesDto[]> {
        return this.repository.createQueryBuilder('cn')
            .select(`cn.id, cn.title, cn.note, cn.state, cn.idcontract,
            cn.iduser, "cn"."created_at" AS date, us.username`)
            .innerJoin('cn.user', 'us')
            .where('cn.state <> 0')
            .getRawMany();
    }

    // Obtenemos una nota por el id
    getOne(id: number): Promise<ContractNotesDto> {
        return this.repository.createQueryBuilder('cn')
            .select(`cn.id, cn.title, cn.note, cn.state, cn.idcontract,
            cn.iduser, "cn"."created_at" AS date, us.username`)
            .innerJoin('cn.user', 'us')
            .where('cn.state <> 0')
            .andWhere(`cn.id = ${id}`)
            .getRawOne();
    }

    // Obtenemos todas las notas de un contrato
    getByContract(idcontract: number): Promise<ContractNotesDto[]> {
        return this.repository.createQueryBuilder('cn')
            .select(`cn.id, cn.title, cn.note, cn.state, cn.idcontract,
            cn.iduser, "cn"."created_at" AS date, us.username`)
            .innerJoin('cn.user', 'us')
            .where('cn.state <> 0')
            .andWhere(`cn.idcontract = ${idcontract}`)
            .getRawMany();
    }

    async create(data: ContractNotes): Promise<ContractNotes> {
        return await this.repository.save(data);
    }

    async update(id: number, data: ContractNotesDto): Promise<ContractNotes> {
        const note = await this.repository.findOne(id);
        if (!note) {
            throw new NotFoundException();
        }
        note.title = data.title;
        note.note = data.note;
        note.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        await note.save();
        return await this.repository.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const bank = await this.repository.findOne(id);
        if (!bank) {
            throw new NotFoundException();
        }
        await this.repository.update(id, { state: 0 });
    }

}
