import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DentalStatus } from "../mat/dental-status/dental-status.entity";
import { Specialty } from "../specialty/specialty.entity";
import { TariffHistory } from "./tariff-history.entity";

@Entity('tariff')
export class Tariff extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 60, nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    description: string;

    @ManyToOne(type => Specialty, specialty => specialty.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'specialty' })
    specialty: Specialty;

    @Column({ type: 'float4', default: 0, nullable: true })
    price_sol: number;

    @Column({ type: 'float4', default: 0, nullable: true })
    price_usd: number;

    @Column({ type: 'boolean', default: false })
    odontograma: boolean;

    @Column({ type: 'boolean', default: false })
    bracket: boolean;

    @Column({ type: 'int', nullable: true, array: true })
    dental_status: number[];

    @Column({ type: 'float4', default: 0, nullable: true })
    cost: number;

    @Column({ type: 'float4', default: 0, nullable: true })
    cost_usd: number;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;

    @Column({ type: 'boolean', default: false, nullable: false })
    show_diary: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 40, default: null, nullable: true })
    idkeyfacil: string;
}