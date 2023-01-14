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
import { Coin } from "src/modules/coin/coin.entity";
import { Bank } from "src/modules/mat/bank/entity/bank.entity";
import { User } from "src/modules/user/user.entity";

@Entity('bank_accounts')
export class BankAccounts extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Bank, ba => ba.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'idbank' })
    bank: Bank;

    @ManyToOne(type => Coin, co => co.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'idcoin' })
    coin: Coin;

    @Column({ type: 'varchar', length: 30, nullable: false })
    account_num: string;

    @Column({ type: 'varchar', length: 80, nullable: false })
    beneficiary: string;

    @Column({ type: 'int2', default: 1, nullable: false })
    status: number;

    @Column({ type: 'int2', nullable: false, default: 0 })
    amount: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;
}