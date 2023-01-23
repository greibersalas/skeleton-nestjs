import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Modules } from "../module/module.entity";

@Entity('masterpermissions')
export class MasterPermissions extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 40, nullable: true })
    page: string;

    @Column({ type: 'int2', nullable: false, default: 1 })
    estado: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 100, default: "" })
    description: string;

    @ManyToOne(type => Modules, mo => mo.id, { cascade: true, nullable: false, eager: true })
    @JoinColumn({ name: 'idmodules' })
    module: Modules;
}