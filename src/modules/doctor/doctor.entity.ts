import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Districts } from "../districts/districts.entity";

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

    @ManyToOne(type => Districts, district => district.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'district'})
    district: Districts;

    @Column({type: 'varchar', nullable: true, default: null, length: 15})
    dni: string;

    @Column({type: 'int8', nullable: true, default: null})
    cop: number;

    @Column({type:'int', nullable: true, array: true})
    specialty: number[];

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

    @Column({type: 'int8', nullable: false, array: true})
    environment: number[];

    @Column({type: 'varchar', length: 40, nullable: false, default: null})
    turn: string;

    @Column({type:'int', nullable: true, array: true})
    business_lines: number[];

    @Column({type: 'int2', nullable: false})
    documentInssued: number;

    @Column({type: 'date', nullable: true})
    dateDocumentInssued: Date;

    @Column({type: 'int2', nullable: false, default: 0})
    number_hours: number;

    @Column({type: 'int2', nullable: false})
    porcentage: number;

    @Column({type: 'varchar', length: 20, nullable: true, default: null})
    type_payment: string;

    @Column({type: 'double precision', nullable: true, default: null})
    payment: number;

    @Column({type: 'boolean', default: false, comment: 'Lunes'})
    mon: boolean;

    @Column({type: 'boolean', default: false, comment: 'Martes'})
    tue: boolean;

    @Column({type: 'boolean', default: false, comment: 'Miercoles'})
    wed: boolean;

    @Column({type: 'boolean', default: false, comment: 'Jueves'})
    thu: boolean;

    @Column({type: 'boolean', default: false, comment: 'Viernes'})
    fri: boolean;

    @Column({type: 'boolean', default: false, comment: 'Sábado'})
    sat: boolean;

    @Column({type: 'boolean', default: false, comment: 'domingo'})
    sun: boolean;

    @Column({type: 'varchar', nullable: true, length: 20, default: null})
    morning_schedule: string;

    @Column({type: 'varchar', nullable: true, length: 20, default: null})
    afternoon_schedule: string;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}