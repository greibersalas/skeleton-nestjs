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
import { SubModules } from "../../sub-module/entity/sub-module.entity";

@Entity('modules_permissions')
export class ModulesPermissions extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;

    @ManyToOne(type => SubModules, sm => sm.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    submodule: SubModules | number;

    @Column({ type: 'boolean', nullable: false, default: false })
    active: boolean;

    @Column({ type: 'boolean', nullable: false, default: false })
    can_insert: boolean;

    @Column({ type: 'boolean', nullable: false, default: false })
    can_update: boolean;

    @Column({ type: 'boolean', nullable: false, default: false })
    can_delete: boolean;

    @Column({ type: 'int2', nullable: false, default: 1 })
    status: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser_created' })
    user_created: User | number;

}