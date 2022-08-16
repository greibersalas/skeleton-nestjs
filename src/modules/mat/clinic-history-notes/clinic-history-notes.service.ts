import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ClinicHistoryNotesRepository } from './clinic-history-notes.repository';
import { ClinicHistoryNotes } from './clinic-history-notes.entity';
import { NotesHistoricXlxDto } from './dto/notes-historial-xls-dto';

@Injectable()
export class ClinicHistoryNotesService {

    constructor(
        @InjectRepository(ClinicHistoryNotesRepository)
        private readonly _clinicHistoryNotesRepository: ClinicHistoryNotesRepository
    ){}

    async get(id: number): Promise<ClinicHistoryNotes>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const clinicHistoryNotes = await this._clinicHistoryNotesRepository.findOne(id,{where:{state:1}});

        if(!clinicHistoryNotes){
            throw new NotFoundException();
        }

        return clinicHistoryNotes;
    }

    async getAll(): Promise<ClinicHistoryNotes[]>{
        const clinicHistoryNotes: ClinicHistoryNotes[] = await this._clinicHistoryNotesRepository.find({where: {state: 1}, order: {id: 'DESC'}});
        return clinicHistoryNotes;
    }

    async create(clinicHistoryNotes: ClinicHistoryNotes): Promise<ClinicHistoryNotes>{
        const saveClinicHistoryNotes: ClinicHistoryNotes = await this._clinicHistoryNotesRepository.save(clinicHistoryNotes);
        return saveClinicHistoryNotes;
    }

    async update(id: number, clinicHistoryNotes:ClinicHistoryNotes): Promise<ClinicHistoryNotes>{
        const clinicHistoryNotesExists = await this._clinicHistoryNotesRepository.findOne(id);
        if(!clinicHistoryNotesExists){
            throw new NotFoundException();
        }
        await this._clinicHistoryNotesRepository.update(id,clinicHistoryNotes);
        const updateClinicHistoryNotes : ClinicHistoryNotes = await this._clinicHistoryNotesRepository.findOne(id);
        return updateClinicHistoryNotes;
    }

    async delete(id: number): Promise<void>{
        const dentalStatusExists = await this._clinicHistoryNotesRepository.findOne(id);
        if(!dentalStatusExists){
            throw new NotFoundException();
        }
        await this._clinicHistoryNotesRepository.update(id,{state:0});
    }

    async getByPatient(id: number): Promise<ClinicHistoryNotes[]>{
        return await this._clinicHistoryNotesRepository.find(
            {
                where: {
                    state: 1,
                    clinichistory: id
                }
            }
        );
    }

    /**
     * Retorna la lista de notas en un rango de fecha solicitado
     * @param since fecha desde
     * @param until fecha hasta
     * @returns 
     */
    async getHistorial(since: string, until: string): Promise<NotesHistoricXlxDto[]>{
        return this._clinicHistoryNotesRepository.createQueryBuilder('chn')
        .select(`chn.id, chn.title, chn.note, chn.updated_at AS last_modification, chn.clinichistory, chn.iddoctor, chn.iduser,
        "dc"."nameQuote" AS doctor,us.username,ch.history, chn.created_at AS created`)
        .innerJoin('chn.doctor','dc')
        .innerJoin('chn.clinichistory','ch')
        .innerJoin('users', 'us', 'us.id = chn.iduser')
        .where(`chn.state = 1
        and chn.created_at::DATE between '${since}' and '${until}'`)
        .orderBy('chn.updated_at','DESC')
        .getRawMany();
    }
}
