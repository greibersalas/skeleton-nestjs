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
import { Doctor } from "src/modules/doctor/doctor.entity";
import { EnvironmentDoctor } from "src/modules/environment-doctor/environment-doctor.entity";
import { Campus } from "src/modules/campus/campus.entity";


@Entity('doctor_programming')
export class DoctorProgramming extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Doctor, dr => dr.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iddoctor' })
    iddoctor: Doctor | number;

    @ManyToOne(type => EnvironmentDoctor, ed => ed.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idenvironmentdoctor' })
    idenvironmentdoctor: EnvironmentDoctor | number;

    @Column({ type: 'date', nullable: false })
    date_since: string;

    @Column({ type: 'date', nullable: false })
    date_until: string;

    @Column({ type: 'text', nullable: false })
    time_since: string;

    @Column({ type: 'text', nullable: false })
    time_until: string;

    @Column({ type: 'int2', nullable: false })
    interval: number;

    @ManyToOne(type => Campus, ca => ca.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idcampus' })
    idcampus: Campus | number;

    @Column({ type: 'int2', default: 1, nullable: false })
    status: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;
}