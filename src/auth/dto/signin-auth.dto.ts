import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    description: 'email',
    example: 'jm@gmail.com',
    required: true,
  })
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email must be not be empty' })
  email: string;

  @ApiProperty({
    description: 'password',
    example: '*******',
    required: true,
    minLength: 6,
  })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password must be not be empty' })
  @MinLength(6, { message: 'password must be minimum of 6' })
  password: string;
}
