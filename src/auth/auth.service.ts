import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Auth } from './entities/auth.entity';
import { SigninDto, SignupDto } from './dto';
import * as crypto from 'crypto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly mailerService: MailerService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: SignupDto): Promise<Auth> {
    try {
      const hashPassword = await argon.hash(dto.password); // hash the password
      const verificationToken = crypto.randomBytes(8).toString('hex'); // generate verififcation token
      const verificationTokenExpiration = Date.now() + 3600000; // 1 hour

      const user = this.authRepository.create({
        ...dto,
        password: hashPassword,
        verification_token: verificationToken,
        verification_token_expiration: verificationTokenExpiration.toString(),
      });

      // Send verification email
      await this.mailerService.sendMail({
        to: dto.email,
        subject: 'Verify your Email',
        html: `<p>Hello ${user.first_name},</p>
  
        <p>Thank you for signing up, you only have one step left, kindly verify using the token: <b>${verificationToken}</b> to complete our signup process</p>
  
        <p>Warm regards,</p>
  
        <p>FX Team</p>
        `,
      });

      await this.authRepository.save(user);

      delete user.password;
      delete user.verification_token;
      delete user.verification_token_expiration;
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const user = await this.authRepository.findOne({
        where: {
          verification_token: token,
          verification_token_expiration: MoreThanOrEqual(Date.now().toString()),
        },
      });
      if (!user) return false;

      user.isVerified = true;
      user.verification_token = null;
      user.verification_token_expiration = null;
      await this.authRepository.save(user);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async login(dto: SigninDto) {
    try {
      const user = await this.authRepository.findOne({
        where: { email: dto.email },
      });

      // If validation fails
      if (!user) {
        throw new UnauthorizedException('Invalid Credential');
      }

      const isValidPassword = await argon.verify(user.password, dto.password);

      // If validation fails
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid Credential');
      }

      // Proceed with your normal login logic (e.g., generating JWT)
      return this.signToken(user.id, user.email, user.isAdmin);
    } catch (error) {
      throw error;
    }
  }

  async signToken(userId: string, email: string, isAdmin: boolean) {
    const payload = { sub: userId, email, isAdmin };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRATION_TIME'),
      secret: this.config.get<string>('JWT_SECRET_KEY'),
    });

    // const refresh_token = await this.jwt.signAsync(payload, {
    //   expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    //   secret: this.config.get<string>('JWT_REFRESH_SECRET_KEY'),
    // });

    return { access_token };
  }

  // async refreshToken(token: string) {
  //   const blacklistToken = await this.authRepository.findOne({
  //     where: { refresh_token: token },
  //   });
  //   if (blacklistToken) {
  //     throw new ForbiddenException('Login, token has been blacklisted!');
  //   }

  //   const decoded = await this.jwt.verifyAsync(token, {
  //     secret: process.env.JWT_REFRESH_SECRET_KEY,
  //   });
  //   if (!decoded) {
  //     throw new UnauthorizedException('Token is invalid');
  //   }

  //   const payload = {
  //     sub: decoded.sub,
  //     email: decoded.email,
  //     role: decoded.role,
  //   };

  //   const access_token = await this.jwt.signAsync(payload, {
  //     expiresIn: this.config.get<string>('JWT_EXPIRATION_TIME'),
  //     secret: this.config.get<string>('JWT_SECRET_KEY'),
  //   });

  //   return { access_token };
  // }
}
