import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BusinessLine } from "../business-line/business-line.entity";
import { Campus } from "../campus/campus.entity";

@Entity('environment_doctor')
export class EnvironmentDoctor extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 40, nullable:false, unique: true})
    name: string;

    @Column({type: 'varchar', nullable: true})
    description: string;

    @ManyToOne(type=>Campus, campus => campus.id,{cascade:true, nullable:false,eager:true})
    @JoinColumn({name:'idcampus'})
    campus: Campus;

    @ManyToOne(type => BusinessLine, bl => bl.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'idbusinessline'})
    businessLine: BusinessLine;


    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @CreateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}