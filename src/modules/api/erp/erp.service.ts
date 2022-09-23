import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Repositories
import { MedicalActAttentionRepository } from 'src/modules/main/medical-act-attention/medical-act-attention.repository';
import { MedicalActAttention } from 'src/modules/main/medical-act-attention/medical-act-attention.entity';
import { PendingPaymentDto } from './dto/pending-payment.dto';

@Injectable()
export class ErpService {

    constructor(
        @InjectRepository(MedicalActAttentionRepository)
        private readonly _medicalActAttentionRepository: MedicalActAttentionRepository
    ){}

    async getPendingPayment(nro_doc: string): Promise<PendingPaymentDto[]>{
        return await this._medicalActAttentionRepository.createQueryBuilder('maa')
        .select(`maa.id,
            "ch"."documentNumber" AS dni,
            ch.invoise_num_document AS id_pagador,
            tr.idkeyfacil AS id_producto,
            tr.name AS detalle,
            maa.quantity AS cantidad,
            maa.value AS precio,
            maa.date AS fecha,
            co.code as moneda
        `)
        .innerJoin('maa.tariff','tr')
        .innerJoin('maa.patient','ch')
        .innerJoin('maa.co','co')
        .innerJoin('payment_method','pm','pm.id = maa.idpaymentmethod')
        .where(`maa.state = 1 AND "ch"."invoise_num_document" = :nro_doc`,{nro_doc})
        .orderBy(`maa.date`)
        .getRawMany();
    }

    async setPayment(ids: number[]): Promise<any>{
        return await this._medicalActAttentionRepository.createQueryBuilder()
            .update(MedicalActAttention)
            .set({state: 2})
            .where(`id IN (:...ids)`,{ids})
            .execute();
    }
}
