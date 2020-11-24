import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('business_line')
export class BusinessLine extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 40, nullable:false, unique: true})
    name: string;

    @Column({type: 'varchar', nullable: true})
    description: string;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @CreateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}