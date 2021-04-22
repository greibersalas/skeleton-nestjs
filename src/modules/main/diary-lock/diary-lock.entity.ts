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

import { Campus } from "../../campus/campus.entity";
import { Doctor } from "../../doctor/doctor.entity";
import { User } from "../../user/user.entity";

@Entity('diary_lock')
export class DiaryLock extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    iddiarylock: number;

    @ManyToOne(type => Doctor, doc => doc.id,{cascade: true, nullable: false, eager: false})
    @JoinColumn({name: 'doctor'})
    doctor: Doctor;

    @ManyToOne(type => Campus, cp => cp.id,{cascade: true, nullable: false, eager: false})
    @JoinColumn({name: 'campus'})
    campus: Campus;

    @ManyToOne(type => User, us => us.id,{cascade: true, nullable: false, eager: false})
    @JoinColumn({name: 'user'})
    user: User;

    @Column({type: 'date', nullable: false})
    date: Date;

    @Column({type: 'time', nullable: false})
    time_since: string;

    @Column({type: 'time', nullable: false})
    time_until: string;

    @Column({type: 'varchar', length: 250, nullable: true, default: null})
    description: string;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;

}