import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'hardcore_challenge_failed', database: 'acore_characters' })
export class HardcoreChallengeFailed {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  @Index()
  @Column({ type: 'int', unsigned: true, default: 0 })
  character_guid!: number;

  @Column({ type: 'varchar', length: 50 })
  player_account!: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  character_level!: number;

  @Column({ type: 'varchar', length: 20 })
  time_of_death!: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  total_spent_time!: number;
}
