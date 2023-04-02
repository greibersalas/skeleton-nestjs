import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Coin } from "../../../../coin/coin.entity"
import { ExchangeHouse } from "../../exchange-house/entity/exchange-house.entity";
import { User } from "src/modules/user/user.entity";


@Entity('exchange_rate')
export class ExchangeRate extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Coin, coin => coin.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'coins' })
    coins: Coin | number;

    @ManyToOne(type => ExchangeHouse, eh => eh.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idexchangehouse' })
    exchangehouse: ExchangeHouse | number;

    @Column({ type: 'float', nullable: false })
    value: number;

    @Column({ type: 'date', nullable: false })
    date: string;

    @Column({ type: 'int2', default: 1, nullable: false, })
    state: number;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}