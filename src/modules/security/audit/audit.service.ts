import { Injectable } from '@nestjs/common';
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
}
