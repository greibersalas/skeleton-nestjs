import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Deparments } from "../deparments/deparments.entity"
import { User } from "../user/user.entity"

@Entity('provinces')
export class Provinces extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Deparments, deparments => deparments.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'deparments'})
    deparments: Deparments;

    @Column({type: 'varchar', length: 20, nullable:false, unique: true})
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