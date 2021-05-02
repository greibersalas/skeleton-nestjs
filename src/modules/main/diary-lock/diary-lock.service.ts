import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DiaryLock } from './diary-lock.entity';
import { DiaryLockRepository } from './diary-lock.repository';

@Injectable()
export class DiaryLockService {

    constructor(
        @InjectRepository(DiaryLockRepository)
        private readonly _diaryLockRepository: DiaryLockRepository
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
        return save;
    }

    async update(id: number, diaryLock:DiaryLock): Promise<DiaryLock>{
        const exists = await this._diaryLockRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._diaryLockRepository.update(id,diaryLock);
        const update : DiaryLock = await this._diaryLockRepository.findOne(id);
        return update;
    }

    async delete(id: number): Promise<void>{
        const exists = await this._diaryLockRepository.findOne(id);
        if(!exists){
            throw new NotFoundException();
        }
        await this._diaryLockRepository.update(id,{state:0});
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
