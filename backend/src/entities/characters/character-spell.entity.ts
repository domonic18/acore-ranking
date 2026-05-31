import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'character_spell', database: 'acore_characters' })
export class CharacterSpell {
  @PrimaryColumn({ type: 'int', unsigned: true, default: 0 })
  guid!: number;

  @PrimaryColumn({ type: 'int', unsigned: true, default: 0 })
  spell!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  active!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  disabled!: number;
}
