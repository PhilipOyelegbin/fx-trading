import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Auth, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: Auth;

  @Column()
  type: string; // e.g., "funding", "trade", "conversion"

  @Column()
  from_currency: string;

  @Column()
  to_currency: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float' })
  rate: number;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending',
  })
  status: 'Pending' | 'Success' | 'Failed';

  @CreateDateColumn()
  timestamp: Date; // Automatically set on creation
}
