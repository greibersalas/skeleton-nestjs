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

@Entity('modules')
export class Modules extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int2', nullable: false, default: 1 })
    status: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;
}