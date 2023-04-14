import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ClinicHistory } from '../clinic-history/clinic-history.entity'

@Entity('attentioncard')
export class AttentionCard extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ClinicHistory, clinichistory => clinichistory.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'clinichistory' })
    clinichistory: ClinicHistory;

    @Column({ type: 'date', nullable: false })
    dateadmission: Date;

    @Column({ type: 'varchar', nullable: false })
    motivo: string;

    @Column({ type: 'boolean', default: false })
    ma: boolean;

    @Column({ type: 'boolean', default: false })
    mmp: boolean;

    @Column({ type: 'boolean', default: false })
    mp: boolean;

    @Column({ type: 'boolean', default: false })
    ar: boolean;

    @Column({ type: 'boolean', default: false })
    dcb: boolean;

    @Column({ type: 'boolean', default: false })
    dtm: boolean;

    @Column({ type: 'boolean', default: false })
    mm: boolean;

    @Column({ type: 'boolean', default: false })
    af: boolean;

    @Column({ type: 'boolean', default: false })
    asc: boolean;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'boolean', default: false })
    mordida_cruzada_a: boolean;

    @Column({ type: 'boolean', default: false })
    mordida_cruzada_p: boolean;

    @Column({ type: 'boolean', default: false })
    mordida_clase_i: boolean;

    @Column({ type: 'boolean', default: false })
    mordida_clase_ii: boolean;

    @Column({ type: 'boolean', default: false })
    mordida_clase_iii: boolean;

    @Column({ type: 'boolean', default: false })
    mordida_profunda: boolean;

    @Column({ type: 'boolean', default: false })
    mordida_abierta: boolean;

    @Column({ type: 'boolean', default: false })
    mordida_tijera: boolean;

    @Column({ type: 'boolean', default: false })
    apinamiento_dental: boolean;

    @Column({ type: 'boolean', default: false })
    inclinacion_plano_oclusal: boolean;

    @Column({ type: 'boolean', default: false })
    desviacion_media_sd: boolean;

    @Column({ type: 'boolean', default: false })
    desviacion_media_si: boolean;

    @Column({ type: 'boolean', default: false })
    desviacion_media_id: boolean;

    @Column({ type: 'boolean', default: false })
    desviacion_media_ii: boolean;

    @Column({ type: 'boolean', default: false })
    asimetria_facial: boolean;

    @Column({ type: 'boolean', default: false })
    retrusion_maxilar: boolean;

    @Column({ type: 'boolean', default: false })
    retrusion_mandibular: boolean;

    @Column({ type: 'boolean', default: false })
    protusion_maxilar: boolean;

    @Column({ type: 'boolean', default: false })
    prognotismo_mandibular: boolean;

    @Column({ type: 'boolean', default: false })
    desviacion_mandibular: boolean;

    @Column({ type: 'boolean', default: false })
    biprotrusion: boolean;

    @Column({ type: 'boolean', default: false })
    biretrusion: boolean;

    @Column({ type: 'boolean', default: false })
    atresia_maxilar: boolean;

    @Column({ type: 'boolean', default: false })
    fisura_labio_palatina: boolean;

    @Column({ type: 'boolean', default: false })
    dtm_articular: boolean;

    @Column({ type: 'boolean', default: false })
    dtm_muscular: boolean;

    @Column({ type: 'boolean', default: false })
    cefalea_atribuida: boolean;

    @Column({ type: 'boolean', default: false })
    sumbido_somato: boolean;
}