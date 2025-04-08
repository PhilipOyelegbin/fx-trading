import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Auth, (user) => user.wallets, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: Auth; // Relationship with the user

  @Column()
  currency: string; // e.g., NGN, USD, EUR

  @Column({ type: 'float', default: 0 })
  balance: number; // Wallet balance
}
