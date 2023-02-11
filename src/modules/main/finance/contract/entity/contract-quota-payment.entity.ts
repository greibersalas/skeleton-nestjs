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
import { ExchangeRate } from "src/modules/exchange-rate/exchange-rate.entity";
import { BankAccounts } from "src/modules/mat/finance/bank-accounts/entity/bank-accounts.entity";

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

    @ManyToOne(type => BankAccounts, ba => ba.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idbankaccount' })
    bankaccount: BankAccounts | number;

    @ManyToOne(type => ExchangeRate, er => er.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idexchangerate' })
    exchangerate: ExchangeRate | number;

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

    @Column({ type: 'varchar', length: 40, nullable: true })
    operation_number: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    document_type: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    document_number: string;

    @Column({ type: 'date', nullable: true })
    document_date: string;

    @Column({ type: 'float', default: 1, nullable: false })
    idpaymentmethod: number;

}