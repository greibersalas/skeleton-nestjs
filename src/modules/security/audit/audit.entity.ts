import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('audit')
export class Audit extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    idaudit: number;

    @Column({type:'int8', nullable: false})
    idregister: number;

    @Column({type:'varchar', length: 60, nullable: false})
    title: string;

    @Column({type:'varchar', length: 255, nullable: false})
    description: string;

    @Column({type:'int8', nullable: false})
    iduser: number;

    @Column({type:'text', nullable: false})
    data: string;

    @Column({type:'timestamp', nullable: false})
    datetime: string;

    @Column({type:'int2', nullable:false, default: 1})
    state: number;

}