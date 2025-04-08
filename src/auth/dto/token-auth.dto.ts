import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    description: 'token',
    example: 'c12d41d807019a81',
    required: true,
  })
  @IsString({ message: 'token must be a string' })
  @IsNotEmpty({ message: 'token must be not be empty' })
  token: string;
}
