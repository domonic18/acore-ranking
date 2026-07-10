import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'hardcore_challenge_failure', database: 'acore_characters' })
export class HardcoreChallengeFailure {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true, default: 0 })
  character_guid!: number;

  @Column({ type: 'varchar', length: 12 })
  character_name!: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  character_level!: number;

  @Column({ type: 'varchar', length: 50 })
  death_reason!: string;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  death_location_map_id!: number;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  death_location_zone_id!: number;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  death_location_area_id!: number;

  @Column({ type: 'float', default: 0 })
  death_location_x!: number;

  @Column({ type: 'float', default: 0 })
  death_location_y!: number;

  @Column({ type: 'float', default: 0 })
  death_location_z!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  killer_info!: string | null;

  @Column({ type: 'int', unsigned: true, default: 0 })
  total_spent_time!: number;

  @Column({ type: 'datetime' })
  failed_at!: Date;
}
