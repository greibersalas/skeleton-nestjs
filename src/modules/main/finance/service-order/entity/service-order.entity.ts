import { ClinicHistory } from "src/modules/clinic-history/clinic-history.entity";
import { User } from "src/modules/user/user.entity";
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

@Entity('service_order')
export class ServiceOrder extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ClinicHistory, ch => ch.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'idclinichistory' })
    clinichistory: ClinicHistory | number;

    @Column({ type: 'char', nullable: false })
    type: string;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;

    @Column({ type: 'varchar', nullable: true })
    num_doc: string;

    @Column({ type: 'date', nullable: true })
    date_doc: string;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at: Date;
}