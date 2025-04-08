import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Transaction } from '../transaction/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    TypeOrmModule.forFeature([Auth]),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [TypeOrmModule],
})
export class WalletModule {}
