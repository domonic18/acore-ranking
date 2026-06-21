import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'hardcore_challenge_progress', database: 'acore_characters' })
export class HardcoreChallengeProgress {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  character_guid!: number;

  @Column({ type: 'varchar', length: 12 })
  character_name!: string;

  @Index()
  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  current_level!: number;

  @Column({ type: 'datetime' })
  started_at!: Date;

  @Column({ type: 'datetime' })
  last_updated_at!: Date;

  @Column({ type: 'int', unsigned: true, default: 0 })
  total_spent_time!: number;
}
