import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users_details')
export class UserDetails extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type:'varchar', length:50, nullable:true})
    name:string;

    @Column({type:'varchar', nullable: true, length:80})
    lastname: string;

    @Column({type:'int2', nullable:true, default:1})
    estado: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}