import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'item_template', database: 'acore_world' })
export class ItemTemplate {
  @PrimaryColumn({ type: 'int', unsigned: true, default: 0 })
  entry!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  class!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  subclass!: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  name!: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  displayid!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  Quality!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  Flags!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  BuyCount!: number;

  @Column({ type: 'int', default: 0 })
  BuyPrice!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  SellPrice!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  InventoryType!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  AllowableClass!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  AllowableRace!: number;

  @Column({ type: 'smallint', default: 0 })
  ItemLevel!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  RequiredLevel!: number;

  @Column({ type: 'smallint', default: 0 })
  RequiredSkill!: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  RequiredSkillRank!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  requiredspell!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  requiredhonorrank!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  RequiredCityRank!: number;

  @Column({ type: 'smallint', default: 0 })
  RequiredReputationFaction!: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  RequiredReputationRank!: number;

  @Column({ type: 'int', default: 0 })
  maxcount!: number;

  @Column({ type: 'int', default: 0 })
  stackable!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  ContainerSlots!: number;
}
