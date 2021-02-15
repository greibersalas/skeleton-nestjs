import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { ClinicHistory } from "../../clinic-history/clinic-history.entity";
import { MedicalAct } from "../medical-act/medical-act.entity";

@Entity('prescription')
export class Prescription extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length:60, nullable:false})
    name: string;

    @Column({type: 'int4', nullable:false})
    amount: number;

    @Column({type: 'varchar', nullable: false, length: 40})
    presentation: string;

    @Column({type: 'varchar', nullable: false, length: 250})
    indications: string;

    @Column({type: 'varchar', nullable: true, length: 250})
    observations: string;

    @ManyToOne(type => ClinicHistory, ch => ch.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn({name:'clinichistory'})
    clinichistory: ClinicHistory;

    @ManyToOne(type => MedicalAct, ma => ma.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn()
    medicalact: MedicalAct;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}