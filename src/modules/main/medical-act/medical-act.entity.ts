import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Reservation } from "../../reservation/reservation.entity";

@Entity('medical_act')
export class MedicalAct extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'text', nullable: false, comment:'Exámen de ingreso'})
    examine_income: string;

    @Column({type: 'text', nullable: false, comment:'Motivo de la consulta'})
    reason: string;

    @Column({type: 'boolean', default: false, comment:'Radiografia'})
    bone_scan: boolean;

    @Column({type: 'boolean', default: false, comment:'Periodontograma'})
    periodontogram: boolean;

    @Column({type: 'boolean', default: false, comment:'Fotografía Clinica'})
    clinical_photography: boolean;

    @Column({type: 'boolean', default: false, comment:'Exámenes de laboratorio'})
    laboratory_exams: boolean;

    @Column({type: 'boolean', default: false, comment:'Modelos de Estudio'})
    study_models: boolean;

    @Column({type: 'text', nullable: false, comment:'Informe Radiográfico'})
    radiographic_report: string;

    @ManyToOne(type => Reservation, reser => reser.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    reservation: Reservation;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}