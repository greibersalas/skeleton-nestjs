import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
var moment = require('moment-timezone');

import { Audit } from '../../security/audit/audit.entity';
import { AuditRepository } from '../../security/audit/audit.repository';

import { DiaryLock } from './diary-lock.entity';
import { DiaryLockRepository } from './diary-lock.repository';

@Injectable()
export class DiaryLockService {

    constructor(
        @InjectRepository(DiaryLockRepository)
        private readonly _diaryLockRepository: DiaryLockRepository,
        @InjectRepository(AuditRepository)
        private readonly _auditRepository: AuditRepository
    ){}

    /**
     * get by id
     * @param id
     */
    async get(id: number): Promise<DiaryLock>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const diaryLock = await this._diaryLockRepository.findOne({
            where:{
                state: 1,
                id
            }
        });

        if(!diaryLock){
            throw new NotFoundException();
        }
        return diaryLock;
    }

    async getAll(): Promise<DiaryLock[]>{
        const diaryLock: DiaryLock[] = await this._diaryLockRepository.find({where:{state:1}});
        return diaryLock;
    }

    async create(diaryLock: DiaryLock): Promise<DiaryLock>{
        const save: DiaryLock = await this._diaryLockRepository.save(diaryLock);
        const audit = new Audit();
        console.log("moment().format('YYYY-MM-DD HH:mm:SS') ",moment().format('YYYY-MM-DD HH:mm:SS'));
        audit.idregister = save.iddiarylock;
        audit.title = 'diary-lock';
        audit.description = 'Insertar registro';
        audit.data = JSON.stringify(save);
        audit.iduser = Number(diaryLock.user);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:SS');
        audit.state = 1;
        await audit.save();
        return save;
    }

    async update(id: number, diaryLock:DiaryLock): Promise<DiaryLock>{
        const exists = await this._diaryLockRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._diaryLockRepository.update(id,diaryLock);
        const update : DiaryLock = await this._diaryLockRepository.findOne(id);
        console.log("moment().format('YYYY-MM-DD HH:mm:SS') ",moment().format('YYYY-MM-DD HH:mm:SS'));
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'diary-lock';
        audit.description = 'Editar registro';
        audit.data = JSON.stringify(update);
        audit.iduser = Number(diaryLock.user);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:SS');
        audit.state = 1;
        await audit.save();
        return update;
    }

    async delete(id: number, iduser: number): Promise<void>{
        const exists = await this._diaryLockRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        const audit = new Audit();
        console.log("moment().format('YYYY-MM-DD HH:mm:SS') ",moment().format('YYYY-MM-DD HH:mm:SS'));
        audit.idregister = id;
        audit.title = 'diary-lock';
        audit.description = 'Borrar registro';
        audit.data = null;
        audit.iduser = iduser;
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:SS');
        audit.state = 1;
        await this._diaryLockRepository.update(id,{state:0});
        await audit.save();
    }

    async onGetList(idcampus: number, since: string, until: string, doctor: number): Promise<DiaryLock[]>{
        if(!since){
            throw new BadRequestException('La fecha desde es requerida');
        }
        if(!until){
            throw new BadRequestException('La fecha hasta es requerida');
        }

        const list = await this._diaryLockRepository.createQueryBuilder('dl')
        .where(`
            dl.date BETWEEN :since AND :until AND dl.campus = :idcampus AND dl.state = 1
            AND dl.doctor = :doctor
        `,{since,until,idcampus,doctor}).getMany();

        return list;
    }
}
