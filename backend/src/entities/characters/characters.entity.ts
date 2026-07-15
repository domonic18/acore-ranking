import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'characters', database: 'acore_characters' })
export class Characters {
  @PrimaryColumn({ type: 'int', unsigned: true })
  guid!: number;

  @Column({ type: 'varchar', length: 12, default: '' })
  name!: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  race!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  class!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  gender!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  level!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  xp!: number;

  @Column({ type: 'int', default: 0 })
  money!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  totaltime!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  leveltime!: number;

  @Index()
  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  online!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  totalKills!: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  todayKills!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  totalHonorPoints!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  arenaPoints!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  knownTitles!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  creation_date!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  last_login!: Date;
}
