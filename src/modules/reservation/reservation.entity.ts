import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { QuotationDetail } from "../main/quotation/quotation-detail.entity";
import { EnvironmentDoctor } from "../environment-doctor/environment-doctor.entity";
import { Doctor } from "../doctor/doctor.entity";

@Entity('reservation')
export class Reservation extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => QuotationDetail, qdetail => qdetail.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn({name:'qdetail_id'})
    qdetail: QuotationDetail;

    @ManyToOne(type => EnvironmentDoctor, environment => environment.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'environment_id'})
    environment: EnvironmentDoctor;

    @ManyToOne(type => Doctor, doctor => doctor.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'doctor_id'})
    doctor: Doctor;

    @Column({type: 'date', nullable:false})
    date: Date;

    @Column({type: 'varchar', length: 50, nullable: false})
    appointment: string;

    @Column({type: 'int2', default: 1, nullable:false,})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}