import { PartialType } from '@nestjs/swagger';
import { FundWalletDto } from './fund-wallet.dto';

export class UpdateWalletDto extends PartialType(FundWalletDto) {}
