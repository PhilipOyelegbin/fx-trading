import { Injectable } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly walletService: WalletService,
  ) {}

  async getTransactionHistory(userId: string) {
    try {
      const transction = await this.transactionRepository.find({
        where: { user: { id: userId } },
        order: { timestamp: 'DESC' },
      });

      return transction;
    } catch (error) {
      throw error;
    }
  }

  async getTransactionHistoryById(userId: string, id: string) {
    try {
      const transction = await this.transactionRepository.findOne({
        where: { id, user: { id: userId } },
        order: { timestamp: 'DESC' },
      });

      return transction;
    } catch (error) {
      throw error;
    }
  }
}
