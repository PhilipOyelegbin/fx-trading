import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { WalletModule } from '../wallet/wallet.module';
import { WalletService } from '../wallet/wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), WalletModule],
  controllers: [TransactionController],
  providers: [TransactionService, WalletService],
})
export class TransactionModule {}
