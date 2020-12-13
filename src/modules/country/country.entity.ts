import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity('countrys')
export class Country extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 30, nullable:false, unique: true})
    name: string;

    @Column({type: 'varchar',length: 2,nullable: false})
    code: string;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @ManyToOne(type => User, user => user.id,{cascade:true, nullable:false})
    @JoinColumn({name:'user'})
    user: User;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}