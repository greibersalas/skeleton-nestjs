import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { QuotationDetail } from "../main/quotation/quotation-detail.entity";
import { EnvironmentDoctor } from "../environment-doctor/environment-doctor.entity";
import { ClinicHistory } from "../clinic-history/clinic-history.entity";
import { Doctor } from "../doctor/doctor.entity";
import { Tariff } from "../tariff/tariff.entity";
import { Coin } from "../coin/coin.entity";

@Entity('reservation')
export class Reservation extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'int', default: 0, nullable: false, })
    qdetail: number;

    @ManyToOne(type => EnvironmentDoctor, environment => environment.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'environment_id' })
    environment: EnvironmentDoctor;

    @ManyToOne(type => Doctor, doctor => doctor.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'doctor_id' })
    doctor: Doctor;

    @Column({ type: 'int8', default: null, nullable: true })
    doctor_id2: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'varchar', length: 50, nullable: false })
    appointment: string;

    @Column({ type: 'int2', default: 1, nullable: false, })
    state: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 500, nullable: true })
    reason: string;

    @ManyToOne(type => ClinicHistory, patient => patient.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'patient_id' })
    patient: ClinicHistory;

    @ManyToOne(type => Tariff, tariff => tariff.id, { cascade: true, nullable: true, eager: true })
    @JoinColumn({ name: 'tariff_id' })
    tariff: Tariff;

    @Column({ type: 'boolean', default: false })
    notify2h: boolean;

    @Column({ type: 'boolean', default: false })
    notify24h: boolean;

    @Column({ type: 'boolean', default: false })
    pending_payment: boolean;

    @Column({ type: 'double precision', nullable: true, default: null })
    amount: number;

    @ManyToOne(type => Coin, co => co.id, { cascade: true, nullable: true, eager: false })
    @JoinColumn({ name: 'idcoin' })
    coin: Coin;

    @Column({ type: 'varchar', default: false })
    since: string;

    @Column({ type: 'varchar', default: false })
    until: string;

    @Column({ type: 'int4', default: false })
    interval: number;
}