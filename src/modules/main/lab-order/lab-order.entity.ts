import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { QuotationDetail } from "../quotation/quotation-detail.entity";
import { Doctor } from "../../doctor/doctor.entity";
import { Tariff } from "../../tariff/tariff.entity";

@Entity('lab_order')
export class LabOrder extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => QuotationDetail, qdet => qdet.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    quotation_detail: QuotationDetail;

    @ManyToOne(type => Doctor, doc => doc.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    doctor: Doctor;

    @ManyToOne(type => Tariff, tr => tr.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn()
    tariff: Tariff;

    @Column({type: 'varchar', default: null, length: 40})
    color: string;

    @Column({type: 'date', nullable: false})
    date: Date;

    @Column({type: 'boolean', default: false})
    chip: boolean;

    @Column({type: 'varchar', default: null, length: 80, comment:'Asistente'})
    assistant: string;

    @Column({type: 'varchar', default: null, length: 250, comment:'Trabajo'})
    job: string;

    @Column({type: 'date', default: null, comment:'instalación'})
    instalation: Date;

    @Column({type: 'date', default: null})
    elaboration: Date;

    @Column({type: 'varchar', length:8, default: '00:00:00'})
    hour: string;

    @Column({type: 'varchar', default: null, length:200, comment:'tecnica'})
    technique: string;

    @Column({type: 'text', default: null, comment:'Observaciones'})
    observation: string;

    @Column({type: 'text', default: null})
    cpt: string;

    @Column({type: 'text', default: null, comment:'Indicaciones Superior'})
    superior_indications: string;

    @Column({type: 'text', default: null, comment:'Indicaciones Inferior'})
    lower_indications: string;

    @Column({type: 'text', default: null, comment:'Observaciones'})
    observation_prescription: string;

    @Column({type: 'varchar', default: null, comment:'Motivo'})
    reason: string;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}