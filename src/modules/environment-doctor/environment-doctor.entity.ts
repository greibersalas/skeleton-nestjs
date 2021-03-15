import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BusinessLine } from "../business-line/business-line.entity";
import { Campus } from "../campus/campus.entity";

@Entity('environment_doctor')
export class EnvironmentDoctor extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 40, nullable:false})
    name: string;

    @Column({type: 'varchar', nullable: true})
    description: string;

    @Column({type: 'int', nullable: false})
    interval: number;

    @Column({type: 'int', nullable: false, default: 0, comment:'Tiempo para limpieza del consultorio'})
    time_cleaning: number;

    @ManyToOne(type=>Campus, campus => campus.id,{cascade:true, nullable:false,eager:true})
    @JoinColumn({name:'idcampus'})
    campus: Campus;

    @ManyToOne(type => BusinessLine, bl => bl.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'idbusinessline'})
    businessLine: BusinessLine;

    @Column({type: 'int', nullable: false, default: 0, comment:'Horario de la mañana desde'})
    schedule_morning_since: number;

    @Column({type: 'int', nullable: false, default: 0, comment:'Horario de la mañana hasta'})
    schedule_morning_until: number;

    @Column({type: 'int', nullable: false, default: 0, comment:'Horario almuerzo desde'})
    lunch_since: number;

    @Column({type: 'int', nullable: false, default: 0, comment:'Horario almuerzo hasta'})
    lunch_until: number;

    //afternoon
    @Column({type: 'int', nullable: false, default: 0})
    schedule_afternoon_since: number;

    @Column({type: 'int', nullable: false, default: 0})
    schedule_afternoon_until: number;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}