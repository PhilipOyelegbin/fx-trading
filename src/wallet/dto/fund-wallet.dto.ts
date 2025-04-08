import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateWalletDto } from './create-wallet.dto';

export class FundWalletDto extends PartialType(CreateWalletDto) {
  @ApiProperty({ description: 'amount', example: 1000.0, required: true })
  @IsNotEmpty({ message: 'amount must be not be empty' })
  @IsNumber({}, { message: 'amount must be a string' })
  amount: number;
}
