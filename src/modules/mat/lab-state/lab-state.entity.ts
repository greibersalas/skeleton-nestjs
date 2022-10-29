import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('lab_state')
export class LabState extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 60, nullable: false, unique: true})
    name: string;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;
    
    @CreateDateColumn({type: 'timestamp', name:'createdAt'})
    createdAt: Date;
    
    @UpdateDateColumn({type: 'timestamp', name:'updatedAt'})
    updatedAt: Date;

    @Column({type: 'int2'})
    iduser: number;

    @Column({type: 'boolean', default: false})
    chip: boolean;
}