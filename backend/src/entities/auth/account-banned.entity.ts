import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'account_banned', database: 'acore_auth' })
export class AccountBanned {
  @PrimaryColumn({ type: 'int', unsigned: true, default: 0 })
  id!: number;

  @PrimaryColumn({ type: 'int', unsigned: true, default: 0 })
  bandate!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  unbandate!: number;

  @Column({ type: 'varchar', length: 255 })
  bannedby!: string;

  @Column({ type: 'varchar', length: 255 })
  banreason!: string;

  @Column({ type: 'tinyint', unsigned: true, default: 1 })
  active!: number;
}
