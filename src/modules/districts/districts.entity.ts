import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Provinces } from "../provinces/provinces.entity"
import { User } from "../user/user.entity"

@Entity('districts')
export class Districts extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Provinces, provinces => provinces.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'provinces'})
    provinces: Provinces;

    @Column({type: 'varchar', length: 30, nullable:false})
    name: string;

    @Column({type: 'varchar', length: 6, nullable:false})
    ubigeo: string;

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