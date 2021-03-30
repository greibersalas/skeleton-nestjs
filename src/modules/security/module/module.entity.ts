import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('modules')
export class Module extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    idmodule: number;

    @Column({type:'varchar', length:30, nullable:false, unique: true})
    id: string;

    @Column({type:'varchar', length:40, nullable:false, unique: true})
    title: string;

    @Column({type:'varchar', length:30, nullable:false, default: 'item'})
    type: string;

    @Column({type:'varchar', length:30, nullable:false, unique: true})
    url: string;

    @Column({type: 'boolean', default: false})
    breadcrumbs: boolean;

    @Column({type: 'varchar', length: 3, nullable: false})
    group: string;

    @Column({type:'text', nullable:false})
    description: string;

    @Column({type:'int2', nullable:false, default:1})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}