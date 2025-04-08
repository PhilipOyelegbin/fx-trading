import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SignupDto } from '../src/auth/dto/signup-auth.dto';
import { SigninDto } from '../src/auth/dto/signin-auth.dto';
import { CreateWalletDto } from '../src/wallet/dto/create-wallet.dto';
import { FundWalletDto } from '../src/wallet/dto/fund-wallet.dto';
import { CreateTransactionDto } from '../src/transaction/dto/create-transaction.dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let token: '';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('/api/v1');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Signup', () => {
    it('(POST) => Should register a new user', () => {
      const user: SignupDto = {
        first_name: 'E2E',
        last_name: 'Test1',
        email: 'test1@gmail.com',
        password: '123456',
        phone_number: '',
      };
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(user)
        .expect(201);
    });
  });

  describe('Get forex rates', () => {
    it('(GET) => Should get the forex rates', () => {
      return request(app.getHttpServer()).get('/api/v1/fx/rates').expect(200);
    });
  });

  describe('Wallet', () => {
    it('(POST) => Should login as a registered user', () => {
      const user: SigninDto = {
        email: 'test1@gmail.com',
        password: '123456',
      };
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(user)
        .expect(200)
        .then((res) => (token = res.body.access_token));
    });

    it('(POST) => Should not create a NGN wallet for the user', () => {
      const wallet: CreateWalletDto = {
        currency: 'NGN',
      };
      return request(app.getHttpServer())
        .post('/api/v1/wallet/create')
        .set('Authorization', 'Bearer ' + token)
        .send(wallet)
        .expect(403);
    });

    it('(POST) => Should not create a CAD wallet for the user', () => {
      const wallet: CreateWalletDto = {
        currency: 'CAD',
      };
      return request(app.getHttpServer())
        .post('/api/v1/wallet/create')
        .set('Authorization', 'Bearer ' + token)
        .send(wallet)
        .expect(403);
    });

    it('(POST) => Should not fund the NGN wallet for the user', () => {
      const wallet: FundWalletDto = {
        currency: 'NGN',
        amount: 200000.0,
      };
      return request(app.getHttpServer())
        .post('/api/v1/wallet/fund')
        .set('Authorization', 'Bearer ' + token)
        .send(wallet)
        .expect(404);
    });

    it('(POST) => Should not perform a transaction from NGN wallet to CAD wallet for the user', () => {
      const wallet: CreateTransactionDto = {
        type: 'trade',
        from_currency: 'NGN',
        to_currency: 'USD',
        amount: 35000.0,
      };
      return request(app.getHttpServer())
        .post('/api/v1/wallet/trade')
        .set('Authorization', 'Bearer ' + token)
        .send(wallet)
        .expect(404);
    });
  });
});
