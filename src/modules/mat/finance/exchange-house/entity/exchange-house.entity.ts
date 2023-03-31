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
import { Coin } from "../../../../coin/coin.entity"
import { User } from "src/modules/user/user.entity";


@Entity('exchange_house')
export class ExchangeHouse extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', nullable: false, length: 60 })
    name: string;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;

    @Column({ type: 'int2', default: 1, nullable: false })
    status: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}