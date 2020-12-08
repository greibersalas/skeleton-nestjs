import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Specialty } from "../specialty/specialty.entity";
import { TariffHistory } from "./tariff-history.entity";

@Entity('tariff')
export class Tariff extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 40, nullable:false, unique: true})
    name: string;

    @Column({type: 'varchar', nullable: true})
    description: string;

    @ManyToOne(type => Specialty, specialty => specialty.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'specialty'})
    specialty: Specialty;

    @OneToMany(() => TariffHistory, tariffHistory => tariffHistory.tariff,{eager:true})
    tariffHistory: TariffHistory[];

    @Column({type: 'float4', default: 0, nullable: true})
    price_sol: number;

    @Column({type: 'float4', default: 0, nullable: true})
    price_usd: number;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}