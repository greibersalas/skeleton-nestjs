import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BusinessLine } from "../business-line/business-line.entity";
import { Specialty } from "../specialty/specialty.entity";

@Entity('doctor')
export class Doctor extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 120, nullable:false})
    name: string;

    @Column({type: 'varchar', length: 80, nullable:false})
    nameQuote: string;    

    @Column({type: 'varchar', nullable: false})
    address: string;

    @Column({type: 'int4', nullable: false})
    district: number;

    @Column({type: 'int8', nullable: false})
    dni: number;

    @Column({type: 'int2', nullable: true})
    cop: number;
    
    /*@Column({type: 'int4', nullable: false})
    specialty: number;*/

    @ManyToOne(type => Specialty, specialty => specialty.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'specialtys'})
    specialtys: Specialty;

    @Column({type: 'date', nullable: true})
    birthdate: Date;

    @Column({type: 'varchar', nullable: true, length: 80})
    email: string;

    @Column({type: 'varchar', nullable: true, length: 20})
    phone: string;

    @Column({type: 'boolean', default: false})
    exclusive: boolean;

    @Column({type: 'date', nullable: true})
    cessationDate: Date;

    @Column({type: 'int4', nullable: false})
    environment: number;

    @Column({type: 'int2', nullable: false})
    turn: number;

    /*@Column({type: 'int4', nullable: false})
    businessLine: number;*/

    @ManyToOne(type => BusinessLine, businessLine => businessLine.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'businessLines'})
    businessLines: BusinessLine;

    @Column({type: 'int2', nullable: false})
    documentInssued: number;

    @Column({type: 'date', nullable: true})
    dateDocumentInssued: Date;

    @Column({type: 'int2', nullable: false, default: 0})
    number_hours: number;

    @Column({type: 'int2', nullable: false})
    percentage: number;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}