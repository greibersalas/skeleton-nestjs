import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Audit } from './audit.entity';
import { AuditRepository } from './audit.repository';

@Injectable()
export class AuditService {

    public iduser: number;
    constructor(
        @InjectRepository(AuditRepository)
        private readonly _auditRepository: AuditRepository
    ){}

    /**
     * Insertamos los datos de la auditoria
     * @param data
     * @returns
     */
    async insert(data: Audit): Promise<boolean>{
        const insert = await this._auditRepository.save(data);
        if(!insert)
            return false;
        return true;
    }

    /**
     * Obtenemos los datos de la auditoria por id
     * @param id
     * @returns
     */
     async get(id: number, module: string): Promise<Audit[]>{
        const get = await this._auditRepository.createQueryBuilder('au')
        .select('us.username,au.*')
        .innerJoin('users','us','us.id = au.iduser')
        .where(`au.idregister = :id and au.title = :module`,{id,module})
        .getRawMany();
        if(!get)
            throw new NotFoundException();
        return get;
    }
}
