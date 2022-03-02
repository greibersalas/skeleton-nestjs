import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('responsible')
export class Responsible extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 60, nullable:false})
    firt_name: string;

    @Column({type: 'varchar', length: 60, nullable:false})
    last_name: string;

    @Column({nullable:false})
    cellphone: number;

    @Column({type: 'varchar', length: 40, nullable:false})
    email: string;
    
    @Column({type: 'varchar', length: 120, nullable:false})
    adress: string;

    @Column({type: 'int2', default: 1, nullable:false,})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}