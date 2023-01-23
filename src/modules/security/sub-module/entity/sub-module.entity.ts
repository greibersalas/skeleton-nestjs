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
import { Modules } from "../../module/module.entity";

@Entity('modules_sub')
export class SubModules extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    title: string;

    @Column({ type: 'varchar', nullable: false, length: 15 })
    type: 'item' | 'collapse' | 'group';

    @Column({ type: 'varchar', nullable: true, length: 80 })
    url: string;

    @Column({ type: 'boolean', nullable: false, default: false })
    target: boolean;

    @Column({ type: 'boolean', nullable: false, default: false })
    breadcrumbs: boolean;

    @Column({ type: 'varchar', nullable: true, length: 40 })
    icon: string;

    @Column({ type: 'varchar', nullable: false, length: 40 })
    code: string;

    @Column({ type: 'varchar', nullable: true, length: 160 })
    description: string;

    @Column({ type: 'int2', nullable: false, default: 1 })
    status: number;

    @Column({ type: 'int2', nullable: true })
    idfather: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;

    @ManyToOne(type => Modules, mo => mo.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'idmodule' })
    module: Modules;
}