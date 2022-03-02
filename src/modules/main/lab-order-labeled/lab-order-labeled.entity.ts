import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { LabeledStatus } from "../../mat/labeled-status/labeled-status.entity";
import { LabOrder } from "../lab-order/lab-order.entity";

@Entity('lab_order_labeled')
export class LabOrderLabeled extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => LabOrder, lo => lo.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn()
    laborder: LabOrder;

    @ManyToOne(type => LabeledStatus, ls => ls.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn()
    status: LabeledStatus;

    /* @Column({type: 'int4', nullable: false})
    status: number; */

    @Column({type: 'date', nullable: false})
    date: Date;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}