import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ClinicHistoryNotesRepository } from './clinic-history-notes.repository';
import { ClinicHistoryNotes } from './clinic-history-notes.entity';

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
        const clinicHistoryNotes: ClinicHistoryNotes[] = await this._clinicHistoryNotesRepository.find({where:{state:1}});
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
}
