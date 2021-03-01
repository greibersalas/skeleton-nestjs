import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('lab_programming')
export class LabProgramming extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', nullable: false, length: 20})
    job: string;

    @Column({type: 'date', nullable: false})
    since: Date;

    @Column({type: 'date', nullable: false})
    until: Date;

    @Column({type: 'int2', nullable: false})
    quantity: number;    

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}