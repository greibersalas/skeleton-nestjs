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
import { ClinicHistory } from "src/modules/clinic-history/clinic-history.entity";
import { User } from "src/modules/user/user.entity";
import { ContractDetail } from "./contract-detail.entity";

@Entity('contract')
export class Contract extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ClinicHistory, ch => ch.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'idclinichistory' })
    clinichistory: ClinicHistory | number;

    @Column({ type: 'char', nullable: false })
    type: string;

    @Column({ type: 'date', nullable: false })
    date: string;

    @Column({ type: 'integer', nullable: false })
    duration: number;

    @Column({ type: 'float', nullable: false })
    amount: number;

    @Column({ type: 'integer', nullable: false })
    quota: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    exchange_house: string;

    @Column({ type: 'varchar', length: 40, nullable: false })
    exchange_house_url: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    executive: string;

    @Column({ type: 'int2', nullable: false })
    amount_controls: number;

    @Column({ type: 'varchar', nullable: false })
    num: string;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at: Date;

    detail?: ContractDetail[];
}