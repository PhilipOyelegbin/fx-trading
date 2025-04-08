import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from './config/mail.config';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { FxModule } from './fx/fx.module';

// ...
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    MailerModule.forRootAsync({
      useClass: MailConfig, // Use the MailConfig class
    }),
    AuthModule,
    WalletModule,
    TransactionModule,
    FxModule,
  ],
})
export class AppModule {}
