import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'achievement_dbc', database: 'acore_world' })
export class AchievementDbc {
  @PrimaryColumn({ type: 'int' })
  ID!: number;

  @Column({ type: 'int', default: 0 })
  requiredFaction!: number;

  @Column({ type: 'int', default: 0 })
  mapID!: number;

  @Column({ type: 'int', default: 0 })
  points!: number;

  @Column({ type: 'int', default: 0 })
  flags!: number;

  @Column({ type: 'int', default: 0 })
  count!: number;

  @Column({ type: 'int', default: 0 })
  refAchievement!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Title_Lang_enUS!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Title_Lang_deDE!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Title_Lang_zhCN!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Title_Lang_zhTW!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Description_Lang_enUS!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Description_Lang_deDE!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Description_Lang_zhCN!: string;
}
