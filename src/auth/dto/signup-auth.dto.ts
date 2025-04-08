import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: 'first_name', example: 'John', required: true })
  @IsString({ message: 'first_name must be a string' })
  @IsNotEmpty({ message: 'first_name must be not be empty' })
  first_name: string;

  @ApiProperty({ description: 'last_name', example: 'Maxwell', required: true })
  @IsString({ message: 'last_name must be a string' })
  @IsNotEmpty({ message: 'last_name must be not be empty' })
  last_name: string;

  @ApiProperty({
    description: 'email',
    example: 'jm@gmail.com',
    required: true,
  })
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email must be not be empty' })
  email: string;

  @ApiPropertyOptional({
    description: 'phone_number',
    example: '+234821234779',
  })
  @IsString({ message: 'phone_number must be a string' })
  @IsOptional()
  phone_number: string;

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
