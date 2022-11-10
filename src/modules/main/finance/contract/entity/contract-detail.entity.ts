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
import { ContractQuotaPayment } from "./contract-quota-payment.entity";
import { Contract } from "./contract.entity";

@Entity('contract_detail')
export class ContractDetail extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Contract, co => co.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idcontract' })
    contract: Contract | number;

    @ManyToOne(type => ContractQuotaPayment, qp => qp.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idcontractquotapayment' })
    quotaPayment: ContractQuotaPayment | number;

    @Column({ type: 'varchar', length: 40, nullable: false })
    description: string;

    @Column({ type: 'varchar', length: 60, nullable: false })
    observation: string;

    @Column({ type: 'date', nullable: false })
    date: string;

    @Column({ type: 'float', nullable: false })
    amount: number;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at: Date;
}