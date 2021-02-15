import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OdontogramaRepository } from './odontograma.repository';
import { Odontograma } from './odontograma.entity';

@Injectable()
export class OdontogramaService {

    constructor(
        @InjectRepository(OdontogramaRepository)
        private readonly _odontogramaRepository: OdontogramaRepository
    ){}

    async get(id: number): Promise<Odontograma>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const odontograma = await this._odontogramaRepository.findOne(id,{where:{state:1}});
        if(!odontograma){
            throw new NotFoundException();
        }
        return odontograma;
    }

    async getAll(): Promise<Odontograma[]>{
        const odontograma: Odontograma[] = await this._odontogramaRepository.find({where:{state:1}});
        return odontograma;
    }

    async create(odontograma: Odontograma): Promise<Odontograma>{
        const saveOdontograma: Odontograma = await this._odontogramaRepository.save(odontograma);
        return saveOdontograma;
    }

    async update(id: number, odontograma:Odontograma): Promise<Odontograma>{
        const odontogramaExists = await this._odontogramaRepository.findOne(id);
        if(!odontogramaExists){
            throw new NotFoundException();
        }
        await this._odontogramaRepository.update(id,odontograma);
        const updateOdontograma : Odontograma = await this._odontogramaRepository.findOne(id);
        return updateOdontograma;
    }

    async delete(id: number): Promise<void>{
        const odontogramaExists = await this._odontogramaRepository.findOne(id);
        if(!odontogramaExists){
            throw new NotFoundException();
        }

        await this._odontogramaRepository.update(id,{state:0});
    }

    /**
     * Return list of odontogramas by clinichistory
     * @param id <clinic history>
     */
    async getByPatient(id: number): Promise<Odontograma[]>{
        return await this._odontogramaRepository.find(
            {
                where: {
                    state: 1,
                    clinichistory: id
                }
            }
        );
    }

    /**
     * Return first odontograma by clinic history
     * @param id <clinichistory>
     */
    async getFirst(id: number): Promise<Odontograma[]>{
        return await this._odontogramaRepository.find(
            {
                where: {
                    state: 1,
                    clinichistory: id
                },
                order: {
                    id: 'DESC'
                },
                take: 1
            }
        );
    }
}
