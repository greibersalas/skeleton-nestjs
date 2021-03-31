import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { ClinicHistory } from "../../clinic-history/clinic-history.entity";
import { User } from "../../user/user.entity";

@Entity('mouth_breathing')
export class MouthBreathing extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ClinicHistory, clinichistory =>clinichistory.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn({name:'clinichistory'})
    clinichistory: ClinicHistory;

    @Column({type: 'date'})
    date: Date;

    @Column({type: 'varchar', nullable: false, length: 8})
    delivery_type: string;

    @Column({type: 'varchar', nullable: true, length: 250})
    lactation: string;

    @Column({type: 'varchar', nullable: true, length: 250})
    lactation_reason: string;

    @Column({type: 'varchar', nullable: true, length: 2})
    feeding_bottle: string;

    @Column({type: 'varchar', nullable: true, length: 80})
    feeding_bottle_str: string;

    @Column({type: 'varchar', nullable: true, length: 2})
    feeding_bottle_nipple: string;

    @Column({type: 'varchar', nullable: true, length: 80})
    feeding_bottle_nipple_str: string;

    @Column({type: 'varchar', nullable: true, length: 2})
    baby_pacifier: string;

    @Column({type: 'varchar', nullable: true, length: 80})
    baby_pacifier_str: string;

    @Column({type: 'varchar', nullable: true, length: 2})
    baby_pacifier_nipple: string;

    @Column({type: 'varchar', nullable: true, length: 80})
    baby_pacifier_nipple_str: string;

    @Column({type: 'varchar', nullable: true, length: 2})
    digital_suction: string;

    @Column({type: 'varchar', nullable: true, length: 80})
    digital_suction_str: string;

    @Column({type: 'varchar', nullable: true, length: 2})
    onicofagia: string;

    @Column({type: 'varchar', nullable: true, length: 80})
    onicofagia_str: string;

    @Column({type: 'varchar', nullable: true, length: 2})
    lip_suction: string;

    @Column({type: 'varchar', nullable: true, length: 80})
    lip_suction_str: string;

    @Column({type: 'varchar', nullable: true, length: 2})
    another_habit: string;

    @Column({type: 'varchar', nullable: true, length: 80})
    another_habit_str: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    hoarse: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    wake_up_several_times: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    sleep_mouth_open: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    moves_lot: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    babea: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    grind_teeth: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    wakeup_donot_breathe: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    has_enuresis: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    talk_asleep: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    somnolent: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    hyperactive: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    difficult_focus: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    irritates_easily: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    fatigue: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    headache: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    rinitis: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    sick_constantly: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    tonsillitis: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    otitis: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    asthma: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    hypertrophy: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    broncoespasmos: string;

    @Column({type: 'varchar', nullable: true, length: 8})
    adenoid_operated: string;

    @Column({type: 'varchar', nullable: true, length: 250})
    diagnosis: string;

    @ManyToOne(type => User, user => user.id,{cascade:true, nullable:false, eager:true})
    @JoinColumn({name:'user'})
    user: User;

    @Column({type:'int2', nullable:false, default:1})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}