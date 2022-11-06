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

// Entity
import { ServiceOrder } from "./service-order.entity";
import { Tariff } from "src/modules/tariff/tariff.entity";
import { Coin } from "src/modules/coin/coin.entity";

@Entity('service_order_detail')
export class ServiceOrderDetail extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ServiceOrder, so => so.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idserviceorder' })
    serviceorder: ServiceOrder;

    @ManyToOne(type => Tariff, ta => ta.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idtariff' })
    tariff: Tariff | number;

    @ManyToOne(type => Coin, co => co.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idcoin' })
    coin: Coin | number;

    @Column({ type: 'int2', default: 1, nullable: false })
    quantity: number;

    @Column({ type: 'int2', nullable: false })
    price: number

    @Column({ type: 'int2', nullable: false })
    total: number;

    @Column({ type: 'int2', nullable: true })
    idorigin: number;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}