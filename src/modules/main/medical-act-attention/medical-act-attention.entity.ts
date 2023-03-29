import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { BusinessLine } from "../../business-line/business-line.entity";
import { Coin } from "../../coin/coin.entity";
import { Doctor } from "../../doctor/doctor.entity";
import { Specialty } from "../../specialty/specialty.entity";
import { Tariff } from "../../tariff/tariff.entity";
import { MedicalAct } from "../medical-act/medical-act.entity";
import { User } from "../../user/user.entity";
import { ClinicHistory } from "../../clinic-history/clinic-history.entity";
import { BankAccounts } from "src/modules/mat/finance/bank-accounts/entity/bank-accounts.entity";
import { PaymentMethodCard } from "src/modules/mat/finance/payment-method-card/entity/payment-method-card.entity";
import { MedicalActFiles } from "../medical-act/medical-act-files.entity";
import { DiscountType } from '../../mat/finance/discount-type/entity/discount-type.entity'
import { ExchangeRate } from "src/modules/exchange-rate/exchange-rate.entity";

@Entity('medical_act_attention')
export class MedicalActAttention extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ClinicHistory, ch => ch.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn()
    patient: ClinicHistory;

    @ManyToOne(type => MedicalAct, ma => ma.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn()
    medicalact: MedicalAct;

    @ManyToOne(type => BusinessLine, bn => bn.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn()
    businessline: BusinessLine;

    @ManyToOne(type => Specialty, sp => sp.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn()
    specialty: Specialty;

    @ManyToOne(type => Tariff, tr => tr.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn()
    tariff: Tariff;

    @Column({ type: 'int4', default: 0 })
    quantity: number;

    @Column({ type: 'float', default: 0 })
    value: number;

    @ManyToOne(type => Coin, co => co.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn()
    co: Coin;

    @ManyToOne(type => Doctor, dr => dr.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn()
    doctor: Doctor;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn()
    user: User;

    @CreateDateColumn({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;

    @Column({ type: 'float', default: 0, nullable: false })
    lab_cost: number;

    @Column({ type: 'float', default: 1, nullable: false })
    idpaymentmethod: number;

    @Column({ type: 'int2', default: 0, nullable: false, comment: 'Comisión de las tarjetas' })
    commission: number;

    @ManyToOne(type => BankAccounts, ba => ba.id, { cascade: true, nullable: true, eager: false })
    @JoinColumn({ name: 'idbankaccount' })
    bankaccount: BankAccounts | number;

    @Column({ type: 'varchar', length: 40, nullable: true })
    operation_number: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    document_type: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    document_number: string;

    @Column({ type: 'date', nullable: true })
    document_date: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => PaymentMethodCard, pm => pm.id, { cascade: true, nullable: true, eager: false })
    @JoinColumn({ name: 'idpaymentmethodcard' })
    card: PaymentMethodCard | number;

    @Column({ type: 'varchar', length: 200, nullable: true })
    reason: string;

    @ManyToOne(type => MedicalActFiles, fi => fi.id, { cascade: true, nullable: true, eager: false })
    @JoinColumn({ name: 'idfile' })
    idfile: MedicalActFiles | number;

    @Column({ type: 'int', default: 1, nullable: false })
    status_payment: number;

    @ManyToOne(type => DiscountType, fi => fi.id, { cascade: true, nullable: true, eager: false })
    @JoinColumn({ name: 'iddiscounttype' })
    iddiscounttype: DiscountType | number;

    @Column({ type: 'char', length: 1, nullable: true, comment: 'A: Monto, P: Porcentaje' })
    discount_type: string;

    @Column({ type: 'float', default: null, nullable: true })
    discount_amount: number;

    @ManyToOne(type => ExchangeRate, er => er.id, { cascade: true, nullable: true, eager: false })
    @JoinColumn({ name: 'idexchangerate' })
    idexchangerate: ExchangeRate | number;
}