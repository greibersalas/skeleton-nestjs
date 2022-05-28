import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { ClinicHistory } from "../../clinic-history/clinic-history.entity";
import { User } from "../../user/user.entity";

@Entity('anamnesis')
export class Anamnesis extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ClinicHistory, ch => ch.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn()
    clinichistory: ClinicHistory;

    @Column({type: 'varchar', default: null, length: 80})
    emergency_contact_name: string;

    @Column({type: 'varchar', default: null, length: 80})
    emergency_contact_cellphone: string;

    @Column({type: 'boolean', default: false})
    medicine: boolean;

    @Column({type: 'varchar', default: null, length: 80})
    medicine_name: string;

    @Column({type: 'varchar', default: null, length: 80})
    medic_name: string;

    @Column({type: 'varchar', default: null, length: 25})
    medic_cellphone: string;

    //hepatitis
    @Column({type: 'boolean', default: false})
    hepatitis: boolean;

    @Column({type: 'varchar', default: null, length: 15})
    hepatitis_type: string;

    //diabetes
    @Column({type: 'boolean', default: false})
    diabetes: boolean;

    @Column({type: 'boolean', default: false})
    compensated: boolean;

    //Presión alta
    @Column({type: 'boolean', default: false})
    high_pressure: boolean;

    //Sufre alguna enfermedad
    @Column({type: 'text', default: null})
    suffers_illness: string;

    //Antecedentes Odontologicos
    @Column({type: 'varchar', default: null, length: 80})
    visit_frequency: string;

    @Column({type: 'text', default: null})
    traumatic_experiences: string;

    //extraído muelas
    @Column({type: 'varchar', default: null, length: 200})
    extracted_molars: string;

    //Complicación a la anestesia
    @Column({type: 'varchar', default: null, length: 250})
    complication_anesthesia: string;

    //Le sangran las encías
    @Column({type: 'boolean', default: false})
    gums_bleed: boolean;

    //Fecha última profilaxia
    @Column({type: 'date', default: null})
    last_prophylaxis: string;

    //Chasquidos
    @Column({type: 'varchar', default: null, length: 250})
    popping: string;

    //esta satisfecho con su estetica
    @Column({type: 'varchar', default: null, length: 250})
    satisfied_aesthetic: string;

    //Fecha última atención
    @Column({type: 'date', default: null})
    last_date: string;

    @Column({type: 'text', default: null})
    observation: string;

    @ManyToOne(type => User, us => us.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn()
    user: User;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}