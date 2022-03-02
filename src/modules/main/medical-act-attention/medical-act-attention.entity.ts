import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { BusinessLine } from "../../business-line/business-line.entity";
import { Coin } from "../../coin/coin.entity";
import { Doctor } from "../../doctor/doctor.entity";
import { Specialty } from "../../specialty/specialty.entity";
import { Tariff } from "../../tariff/tariff.entity";
import { MedicalAct } from "../medical-act/medical-act.entity";
import { User } from "../../user/user.entity";
import { ClinicHistory } from "../../clinic-history/clinic-history.entity";

@Entity('medical_act_attention')
export class MedicalActAttention extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ClinicHistory, ch => ch.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    patient: ClinicHistory;

    @ManyToOne(type => MedicalAct, ma => ma.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    medicalact: MedicalAct;

    @ManyToOne(type => BusinessLine, bn => bn.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    businessline: BusinessLine;

    @ManyToOne(type => Specialty, sp => sp.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    specialty: Specialty;

    @ManyToOne(type => Tariff, tr => tr.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn()
    tariff: Tariff;

    @Column({type: 'int4', default: 0})
    quantity: number;

    @Column({type: 'float', default: 0})
    value: number;

    @ManyToOne(type => Coin, co => co.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    co: Coin;

    @ManyToOne(type => Doctor, dr => dr.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    doctor: Doctor;

    @ManyToOne(type => User, us => us.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn()
    user: User;

    @CreateDateColumn({type:'date',nullable: false})
    date: Date;

    @Column({type: 'int2', default: 1, nullable: false})
    state: number;

    @Column({type: 'float', default: 0, nullable: false})
    lab_cost: number;

    @Column({type: 'float', default: 1, nullable: false})
    idpaymentmethod: number;

    @Column({type: 'int2', default: 0, nullable: false, comment: 'Comisión de las tarjetas'})
    commission: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}