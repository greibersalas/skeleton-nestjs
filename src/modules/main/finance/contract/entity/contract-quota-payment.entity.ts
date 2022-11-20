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
import { Coin } from "src/modules/coin/coin.entity";
import { Contract } from "./contract.entity";

@Entity('contract_quota_payment')
export class ContractQuotaPayment extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'date', nullable: false })
    payment_date: string;

    @ManyToOne(type => Coin, co => co.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idcoin' })
    coin: Coin | number;

    @ManyToOne(type => Contract, ct => ct.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idcontract' })
    contract: Contract | number;

    @Column({ type: 'float', nullable: false })
    amount: number;

    @Column({ type: 'varchar', length: 200, nullable: true })
    observation: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    bank: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    file_name: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    file_ext: string;

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