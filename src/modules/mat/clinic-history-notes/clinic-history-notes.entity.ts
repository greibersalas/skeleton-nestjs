import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { ClinicHistory } from "../../clinic-history/clinic-history.entity";
import { Doctor } from "../../doctor/doctor.entity";

@Entity('clinic_history_notes')
export class ClinicHistoryNotes extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length:40, nullable:false})
    title: string;

    @Column({type: 'text', nullable:false})
    note: string;

    @ManyToOne(type => ClinicHistory, ch => ch.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn({name:'clinichistory'})
    clinichistory: ClinicHistory;

    @ManyToOne(type => Doctor, doctor => doctor.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'iddoctor'})
    doctor: Doctor;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}