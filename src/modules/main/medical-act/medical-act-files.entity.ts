import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { MedicalActFileGroup } from "./medical-act-file-group.entity";
import { MedicalAct } from "./medical-act.entity";

@Entity('medical_act_files')
export class MedicalActFiles extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', nullable: true, default: null, length: 250})
    desciption: string;

    @Column({type: 'varchar', nullable: false, length: 160})
    fila_name: string;

    @Column({type: 'varchar', nullable: false, length: 10})
    file_ext: string;

    @ManyToOne(type => MedicalAct, ma => ma.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    medicalact: MedicalAct;

    @ManyToOne(type => MedicalActFileGroup, mafg => mafg.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    filegroup: MedicalActFileGroup;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}