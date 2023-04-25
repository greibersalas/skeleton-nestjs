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
import { User } from "src/modules/user/user.entity";
import { ClinicHistory } from "src/modules/clinic-history/clinic-history.entity";
import { Reservation } from "src/modules/reservation/reservation.entity";
import { Doctor } from "src/modules/doctor/doctor.entity";


@Entity('incidents')
export class Incidents extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ClinicHistory, ch => ch.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idclinichistory' })
    idclinichistory: ClinicHistory | number;

    @Column({ type: 'date', nullable: true })
    date: string;

    @Column({ type: 'time', nullable: true })
    arrival_time: string;

    @Column({ type: 'time', nullable: true })
    office_admission_time: string;

    @Column({ type: 'time', nullable: true })
    office_departure_time: string;

    @Column({ type: 'time', nullable: true })
    departure_time: string;

    @Column({ type: 'text', nullable: true })
    reason_attendance: string;

    @Column({ type: 'text', nullable: true })
    reason: string;

    @Column({ type: 'text', nullable: true })
    observations: string;

    @Column({ type: 'int2', default: 1, nullable: false })
    status: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;

    @ManyToOne(type => Reservation, re => re.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idreservation' })
    idreservation: ClinicHistory | number;

    @ManyToOne(type => Doctor, dr => dr.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iddoctor' })
    iddoctor: Doctor | number;

}