import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Specialty } from "../specialty/specialty.entity";
import { Tariff } from "./tariff.entity";

@Entity('tariff_history')
export class TariffHistory extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'float4', default: 0, nullable: true})
    price_sol_old: number;

    @Column({type: 'float4', default: 0, nullable: true})
    price_usd_old: number;

    @Column({type: 'float4', default: 0, nullable: true})
    price_sol_new: number;

    @Column({type: 'float4', default: 0, nullable: true})
    price_usd_new: number;

    /* @ManyToOne(() => Tariff, tariff => tariff.tariffHistory)
    tariff: Tariff; */
    @ManyToOne(type => Tariff, tariff => tariff.id, {cascade:true, nullable: false, eager: false})
    @JoinColumn({name: 'idtariff'})
    tariff: Tariff;

    @Column({type: 'int2', default: 1, nullable: false})
    state: number;

    @CreateDateColumn({type: 'timestamp', name: 'created_at'})
    createdAt: Date;

}