import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { QuotationDetail } from "../quotation/quotation-detail.entity";
import { Doctor } from "../../doctor/doctor.entity";

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

    @Column({type: 'varchar', default: null, length:200, comment:'tecnica'})
    technique: string;

    @Column({type: 'text', default: null, comment:'Observaciones'})
    observation: string;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}