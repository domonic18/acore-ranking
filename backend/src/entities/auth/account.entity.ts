import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'account', database: 'acore_auth' })
export class Account {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 32 })
  username!: string;

  @Column({ type: 'varchar', length: 128 })
  salt!: string;

  @Column({ type: 'varchar', length: 128 })
  verifier!: string;

  @Column({ type: 'varchar', length: 64 })
  email!: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  expansion!: number;

  @Column({ type: 'varchar', length: 64, default: '127.0.0.1' })
  last_ip!: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  last_attempt_ip!: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  failed_logins!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  locked!: number;

  @Column({ type: 'varchar', length: 40 })
  lock_country!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  last_login!: Date;

  @Column({ type: 'int', unsigned: true, default: 0 })
  online!: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  locale!: number;

  @Column({ type: 'varchar', length: 50 })
  os!: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  recruiter!: number;
}
