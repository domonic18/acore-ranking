import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'hardcore_challenge_exit', database: 'acore_characters' })
export class HardcoreChallengeExit {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true, default: 0 })
  character_guid!: number;

  @Column({ type: 'varchar', length: 12 })
  character_name!: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  current_level!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  total_spent_time!: number;

  @Column({ type: 'datetime' })
  exited_at!: Date;
}
