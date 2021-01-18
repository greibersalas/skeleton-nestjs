import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { BusinessLine } from "../../business-line/business-line.entity";
import { ClinicHistory } from "../../clinic-history/clinic-history.entity";
import { Coin } from "../../coin/coin.entity";
import { Doctor } from "../../doctor/doctor.entity";
import { Specialty } from "../../specialty/specialty.entity";
import { QuotationDetail } from "./quotation-detail.entity";

@Entity('quotation')
export class Quotation extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'date', nullable:false})
    date: Date;

    @ManyToOne(type => ClinicHistory, clinicHistory => clinicHistory.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'idclinichistory'})
    clinicHistory: ClinicHistory;

    @ManyToOne(type => Coin, coin => coin.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'idcoin'})
    coin: Coin;

    @ManyToOne(type => BusinessLine, bl => bl.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'idbusinessline'})
    businessLine: BusinessLine;

    @ManyToOne(type => Specialty, specialty => specialty.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'specialty'})
    specialty: Specialty;

    @ManyToOne(type => Doctor, doctor => doctor.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'iddoctor'})
    doctor: Doctor;

    @Column({type: 'float8', default: 0, nullable: false})
    subtotal: number;

    @Column({type: 'float8', default: 0, nullable: false})
    tax: number;

    @Column({type: 'float8', default: 0, nullable: false})
    discount: number;

    @Column({type: 'float8', default: 0, nullable: false})
    total: number;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;

    detail: QuotationDetail[];
}