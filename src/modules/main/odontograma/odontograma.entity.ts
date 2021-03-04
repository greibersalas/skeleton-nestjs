import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Quotation } from "../quotation/quotation.entity";
import { ClinicHistory } from "../../clinic-history/clinic-history.entity";

@Entity('odontograma')
export class Odontograma extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'text', nullable:false})
    name: string;

    @ManyToOne(type => ClinicHistory, ch => ch.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'clinichistory'})
    clinichistory: ClinicHistory;

    @ManyToOne(type => Quotation, quotation => quotation.id,{cascade:true, nullable:true})
    @JoinColumn({name:'quotation'})
    quotation: Quotation;

    @Column({type: 'int2', default: 1, nullable:false,})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}