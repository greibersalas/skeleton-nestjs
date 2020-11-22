import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('roles')
export class Role extends BaseEntity{
    
    @PrimaryGeneratedColumn('increment')
    idrole: number;

    @Column({type:'varchar', length:20, nullable:false})
    name: string;

    @Column({type:'text', nullable:false})
    description: string;

    @Column({type:'int2', nullable:false, default:1})
    estado: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}