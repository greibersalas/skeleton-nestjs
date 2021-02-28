import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { LabeledStatus } from "../../mat/labeled-status/labeled-status.entity";

@Entity('lab_programming')
export class LabProgramming extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => LabeledStatus, ls => ls.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    labeledstatus: LabeledStatus;

    @Column({type: 'date', nullable: false})
    since: Date;

    @Column({type: 'date', nullable: false})
    until: Date;

    @Column({type: 'int2', nullable: false})
    quantity: number;    

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}