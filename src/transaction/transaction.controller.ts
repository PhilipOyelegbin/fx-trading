import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOkResponse({ description: 'Successful' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get('')
  getHistory(@GetUser() user: { id: string }) {
    return this.transactionService.getTransactionHistory(user.id);
  }

  @ApiOkResponse({ description: 'Successful' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  getTransactionHistoryById(
    @GetUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.transactionService.getTransactionHistoryById(user.id, id);
  }
}
