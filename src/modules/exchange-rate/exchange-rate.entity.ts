import { BaseEntity, Column, CreateDateColumn, Entity,  JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Coin } from "../coin/coin.entity"


@Entity('exchange_rate')
export class ExchangeRate extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Coin, coin => coin.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'coins'})
    coins: Coin;

    @Column({type: 'float', nullable:false})
    value: number;

    @Column({type: 'date', nullable: false})
    date: Date;

    @Column({type: 'int2', default: 1, nullable:false,})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}