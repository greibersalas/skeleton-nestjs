import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { Role } from '../security/role/role.entity';

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

    @ManyToOne(type=>Role,{cascade:true,nullable:false,eager:true})
    @JoinColumn({name:'role_id'})
    roles: Role;

    @ManyToOne(type=> Doctor, doc => doc.id,{cascade:true,nullable:true,eager:false})
    @JoinColumn()
    doctor: Doctor;

    @Column({type:'int', nullable: true, array: true})
    campus: number[];

    @Column({type:'int2', nullable:false, default:1})
    estado: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}