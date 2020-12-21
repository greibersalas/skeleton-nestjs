import { BaseEntity, Column, CreateDateColumn, Entity,  JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Country } from "../country/country.entity"
import { User } from "../user/user.entity"

@Entity('deparments')
export class Deparments extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Country, country => country.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'countrys'})
    countrys: Country;

    @Column({type: 'varchar', length: 30, nullable:false})
    name: string;

    @ManyToOne(type => User, user => user.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'users'})
    users: User;

    @Column({type: 'int2', default: 1, nullable:false,})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}