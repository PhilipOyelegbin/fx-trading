import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Auth } from '../auth/entities/auth.entity';
import { FundWalletDto } from './dto';
import { ConfigService } from '@nestjs/config';
import * as cache from 'memory-cache';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Auth)
    private readonly userRepository: Repository<Auth>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly config: ConfigService,
  ) {}

  async createWallet(userId: string, currency: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isVerified) {
        throw new ForbiddenException('User not verified');
      }

      const existingWallet = await this.walletRepository.findOne({
        where: { user: { id: userId }, currency },
      });
      if (existingWallet) {
        throw new BadRequestException('Wallet already created');
      }

      const wallet = this.walletRepository.create({
        user,
        currency,
        balance: 0,
      });

      await this.walletRepository.save(wallet);
      return wallet;
    } catch (error) {
      throw error;
    }
  }

  async checkAllBalance(userId: string) {
    try {
      const wallet = await this.walletRepository.find({
        where: { user: { id: userId } },
      });
      if (!wallet || wallet.length <= 0) {
        throw new NotFoundException('Wallet not found');
      }
      if (!wallet[0].user.isVerified) {
        throw new ForbiddenException('User not verified');
      }

      return wallet;
    } catch (error) {
      throw error;
    }
  }

  async checkBalance(userId: string, currency: string) {
    try {
      const wallet = await this.walletRepository.findOne({
        where: { user: { id: userId }, currency },
      });
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
      if (!wallet.user.isVerified) {
        throw new ForbiddenException('User not verified');
      }

      return { balance: wallet.balance };
    } catch (error) {
      throw error;
    }
  }

  async convert(
    userId: string,
    fromCurrency: string,
    toCurrency: string,
    amount: number,
  ) {
    try {
      const wallet = await this.walletRepository.findOne({
        where: { user: { id: userId }, currency: fromCurrency },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
      if (!wallet.user.isVerified) {
        throw new ForbiddenException('User not verified');
      }

      return this.cacheConversion(wallet.currency, toCurrency, amount);
    } catch (error) {
      throw error;
    }
  }

  async cacheConversion(
    fromCurrency: string,
    toCurrency: string,
    balance: number,
  ) {
    const cachedRates = cache.get(fromCurrency);
    if (cachedRates) {
      return cachedRates;
    }

    const convertion = await fetch(
      `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=${fromCurrency}&to=${toCurrency}&amount=${balance}`,
      {
        headers: {
          'x-rapidapi-key': this.config.getOrThrow('RAPIDAPI_KEY'),
          'x-rapidapi-host': this.config.getOrThrow('RAPIDAPI_HOST'),
        },
      },
    );

    const data = await convertion.json();
    // Cache the rates for performance (e.g., 10 minutes)
    cache.put(fromCurrency, data, 10 * 60 * 1000);
    return data;
  }

  async fundWallet(userId: string, dto: FundWalletDto): Promise<Wallet> {
    try {
      if (dto.amount <= 0) {
        throw new BadRequestException('Amount must be greater than zero');
      }

      const wallet = await this.walletRepository.findOne({
        where: { user: { id: userId }, currency: dto.currency },
        relations: ['user'],
      });
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
      if (!wallet.user.isVerified) {
        throw new ForbiddenException('User not verified');
      }

      wallet.balance += dto.amount; // Add funds to the wallet
      return await this.walletRepository.save(wallet);
    } catch (error) {
      throw error;
    }
  }

  async tradeCurrency(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<string> {
    // Fetch the user's wallet for both currencies
    const fromWallet = await this.walletRepository.findOneBy({
      user: { id: userId },
      currency: dto.from_currency,
    });
    const toWallet = await this.walletRepository.findOneBy({
      user: { id: userId },
      currency: dto.to_currency,
    });

    if (!fromWallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (fromWallet.balance < dto.amount) {
      throw new BadRequestException('Insufficient funds in the source wallet');
    }

    if (!toWallet) {
      throw new NotFoundException('Target wallet not found');
    }

    const rates = await this.cacheConversion(
      dto.from_currency,
      dto.to_currency,
      dto.amount,
    );
    const convertedAmount = rates.result;

    // Update wallet balances
    fromWallet.balance -= dto.amount;
    toWallet.balance += convertedAmount;

    await this.walletRepository.save(fromWallet);
    await this.walletRepository.save(toWallet);

    // Log transaction
    await this.transactionRepository.save({
      ...dto,
      user: fromWallet.user,
      amount: convertedAmount,
      rate: rates.info.rate,
      status: 'Success',
      timestamp: new Date(),
    });

    return 'Trade successful';
  }
}
