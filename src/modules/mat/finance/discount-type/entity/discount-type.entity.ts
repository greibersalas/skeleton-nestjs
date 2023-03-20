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
import { User } from "../../../../user/user.entity";

@Entity('discount_type')
export class DiscountType extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;


    @Column({ type: 'varchar', length: 30, nullable: false })
    name: string;

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