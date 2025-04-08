import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: 'type', example: 'trade', required: true })
  @IsString({ message: 'type must be a string' })
  @IsNotEmpty({ message: 'type must not be empty' })
  type: string;

  @ApiProperty({ description: 'from_currency', example: 'NGN', required: true })
  @IsString({ message: 'from_currency must be a string' })
  @IsNotEmpty({ message: 'from_currency must not be empty' })
  from_currency: string;

  @ApiProperty({ description: 'to_currency', example: 'USD', required: true })
  @IsString({ message: 'to_currency must be a string' })
  @IsNotEmpty({ message: 'to_currency must not be empty' })
  to_currency: string;

  @ApiProperty({ description: 'amount', example: 10000.0, required: true })
  @IsNumber({}, { message: 'amount must be a number' })
  @IsNotEmpty({ message: 'amount must not be empty' })
  amount: number;

  //   @ApiProperty({ description: 'rate', example: '', required: true })
  //   @IsNumber({}, { message: 'rate must be a number' })
  //   @IsNotEmpty({ message: 'rate must not be empty' })
  //   rate: number;
}
