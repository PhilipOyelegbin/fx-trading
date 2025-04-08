import { Controller, Get } from '@nestjs/common';
import { FxService } from './fx.service';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @ApiOkResponse({ description: 'Successful' })
  @Get('rates')
  fxRates() {
    return this.fxService.fxRates();
  }
}
