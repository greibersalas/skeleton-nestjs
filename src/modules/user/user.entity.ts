import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../role/role.entity';
import { UserDetails } from './user.details.entity';

@Entity('users')
export class User extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type:'varchar', unique:true, length:25, nullable:false})
    username:string;

    @Column({type:'varchar', nullable: false, length:80})
    email: string;

    @Column({type:'varchar',nullable:false})
    password:string;

    @OneToOne(type=>UserDetails,{cascade:true, nullable:false, eager:true})//eager: automaticamente trae el detalle
    @JoinColumn({name:'detail_id'})
    details: UserDetails;

    @ManyToOne(type=>Role,{cascade:true,nullable:false,eager:true})
    @JoinColumn({name:'role_id'})
    roles: Role

    @Column({type:'int2', nullable:false, default:1})
    estado: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}