import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'character_achievement', database: 'acore_characters' })
export class CharacterAchievement {
  @PrimaryColumn({ type: 'int', unsigned: true, default: 0 })
  guid!: number;

  @PrimaryColumn({ type: 'smallint', unsigned: true, default: 0 })
  achievement!: number;

  @Column({ type: 'int', default: 0 })
  date!: number;
}
