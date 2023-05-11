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
import { TreatmentStages } from "src/modules/mat/operations/treatment-stages/entity/treatment-stages.entity";


@Entity('clinic_history_treatment_stages')
export class ClinicHistoryTreatmentStages extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ClinicHistory, ch => ch.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idclinichistory' })
    idclinichistory: ClinicHistory | number;

    @ManyToOne(type => TreatmentStages, ts => ts.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idtreatmentstage' })
    idtreatmentstage: TreatmentStages | number;

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