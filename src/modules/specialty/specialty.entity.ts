import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BusinessLine } from "../business-line/business-line.entity";

@Entity('specialty')
export class Specialty extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 40, nullable:false, unique: true})
    name: string;

    @Column({type: 'varchar', nullable: true})
    description: string;

    @ManyToOne(type => BusinessLine, businessLine => businessLine.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'businessLines'})
    businessLines: BusinessLine;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @CreateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}