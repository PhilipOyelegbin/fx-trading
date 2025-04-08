import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto, TokenDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiInternalServerErrorResponse({ description: 'Internal Server error' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'User created' })
  @ApiBadRequestResponse({ description: 'Credentials taken' })
  @Post('register')
  register(@Body() dto: SignupDto) {
    return this.authService.register(dto);
  }

  @ApiOkResponse({ description: 'Email verification successfully' })
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verifyEmail(@Body() dto: TokenDto) {
    const isVerified = await this.authService.verifyEmail(dto.token);
    if (isVerified) {
      return { message: 'Email successfully verified.' };
    } else {
      return { message: 'Verification failed or token invalid.' };
    }
  }

  @ApiOkResponse({ description: 'Authentication passsed' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: SigninDto) {
    return this.authService.login(dto);
  }
}
