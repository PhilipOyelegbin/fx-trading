import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto, FundWalletDto } from './dto';
import { Auth } from '../auth/entities/auth.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is unathorized to perform this action',
})
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiInternalServerErrorResponse({ description: 'Internal Server error' })
@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiCreatedResponse({ description: 'Wallet created successfull' })
  @Post('create')
  createWallet(@GetUser() user: Auth, @Body() dto: CreateWalletDto) {
    return this.walletService.createWallet(user.id, dto.currency);
  }

  @ApiCreatedResponse({ description: 'Wallet funded successfull' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Post('fund')
  fundWallet(@GetUser() user: Auth, @Body() dto: FundWalletDto) {
    return this.walletService.fundWallet(user.id, dto);
  }

  @ApiCreatedResponse({ description: 'Successfull' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Post('convert')
  convert(
    @GetUser() user: Auth,
    @Query('fromCurrency') fromCurrency: string,
    @Query('toCurrency') toCurrency: string,
    @Query('amount') amount: number,
  ) {
    return this.walletService.convert(
      user.id,
      fromCurrency,
      toCurrency,
      amount,
    );
  }

  @ApiCreatedResponse({ description: 'Successful' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Post('trade')
  tradeCurreny(
    @GetUser() user: { id: string },
    @Body() dto: CreateTransactionDto,
  ) {
    return this.walletService.tradeCurrency(user.id, dto);
  }

  @ApiOkResponse({ description: 'Successfull' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get('')
  checkAllBalance(@GetUser() user: Auth) {
    return this.walletService.checkAllBalance(user.id);
  }

  @ApiOkResponse({ description: 'Successfull' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':currency')
  checkBalance(@GetUser() user: Auth, @Param('currency') currency: string) {
    return this.walletService.checkBalance(user.id, currency);
  }
}
