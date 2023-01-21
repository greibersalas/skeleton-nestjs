import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Campus } from "../campus/campus.entity";
import { Districts } from "../districts/districts.entity";
import { InsuranceCarrier } from "../insurance-carrier/insurance-carrier.entity";

@Entity('clinic_history')
export class ClinicHistory extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @ManyToOne(type => Campus, campus => campus.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'campus' })
    campus: Campus;

    @Column({ type: 'int8', nullable: false })
    client: number;

    @Column({ type: 'varchar', length: 60, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    lastNameFather: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    lastNameMother: string;

    @Column({ type: 'varchar', nullable: false, length: 15 })
    documentNumber: string;

    @Column({ type: 'varchar', length: 80 })
    relationship: string;

    @Column({ type: 'date', nullable: true })
    birthdate: Date;

    @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
    history: string;

    @Column({ type: 'bigint', nullable: false, default: 0 })
    history_correlative: number;

    @Column({ type: 'varchar', length: 10, nullable: false })
    sex: string;

    @Column({ type: 'varchar', length: 11, nullable: true })
    ruc: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    address: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    country: string;

    @ManyToOne(type => Districts, district => district.id, { cascade: true, nullable: true, eager: true })
    @JoinColumn({ name: 'district' })
    district: Districts;

    @Column({ type: 'varchar', length: 80, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    cellphone: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    studyCenter: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    knowledge: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    referred: string;

    @Column({ type: 'varchar', length: 120, nullable: true })
    placeOrigen: string;

    @Column({ type: 'varchar', length: 60, nullable: true })
    birthPlace: string;

    @Column({ type: 'varchar', length: 80, nullable: true, default: null })
    attorney: string;

    @Column({ type: 'boolean', default: false })
    vip: boolean;

    @Column({ type: 'text', nullable: false })
    previousAttentions: string;

    @ManyToOne(type => InsuranceCarrier, ic => ic.id, { cascade: true, nullable: true, eager: true })
    @JoinColumn({ name: 'insuranceCarrier' })
    insuranceCarrier: InsuranceCarrier;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;

    @Column({ type: 'varchar', default: null, nullable: true })
    invoise_type_document: string;

    @Column({ type: 'varchar', default: null, nullable: true })
    invoise_num_document: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    quotasPending?: number;
}