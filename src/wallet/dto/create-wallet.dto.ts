import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ description: 'currency', example: 'USD', required: true })
  @IsNotEmpty({ message: 'currency must be not be empty' })
  @IsString({ message: 'currency must be a string' })
  currency: string;
}
