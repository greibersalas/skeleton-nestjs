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

import { Tariff } from "src/modules/tariff/tariff.entity";
import { User } from "src/modules/user/user.entity";

@Entity('treatment_stages')
export class TreatmentStages extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Tariff, ta => ta.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idtariff' })
    idtariff: User | number;

    @Column({ type: 'varchar', length: 60, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 200, nullable: false })
    description: string;

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