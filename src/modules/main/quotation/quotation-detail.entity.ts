import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Coin } from "../../coin/coin.entity";
import { Quotation } from "./quotation.entity";
import { Tariff } from "../../tariff/tariff.entity";

@Entity('quotation_detail')
export class QuotationDetail extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Quotation, quotation => quotation.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn({name:'idquotation'})
    quotation: Quotation;

    @ManyToOne(type => Tariff, tariff => tariff.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn({name:'idtariff'})
    tariff: Tariff;

    @ManyToOne(type => Coin, coin => coin.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn()
    coin: Coin;

    @Column({type: 'float8', default: 0, nullable: false})
    price: number;

    @Column({type: 'float8', default: 0, nullable: false})
    quantity: number;

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
}