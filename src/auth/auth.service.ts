import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { plainToClass } from 'class-transformer';
import { AuthUserSerializer } from './serialization';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailer: MailerService,
  ) {}
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // If user not found thorw error
    if (!user) {
      throw new ForbiddenException('Credentials Incorrect');
    }
    const pwMatches = await argon.verify(user.hash, dto.password);
    // If user found but password doesn't match
    if (!pwMatches) {
      throw new ForbiddenException('Credentials Incorrect');
    }
    if (user.isEmailConfirmed === false || user.activeStatus === false) {
      throw new ForbiddenException('User not active');
    }
    const jwtToken = await this.signToken(user.id, user.email);
    const data = { ...user, token: jwtToken };

    // serialize to remove password
    return plainToClass(AuthUserSerializer, data, {
      excludeExtraneousValues: true,
    });
  }
  async signup(dto: AuthDto) {
    // generate password
    const hash = await argon.hash(dto.password);
    // save de user to the db and generate activation token
    try {
      // save de user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          firstName: dto.firstName,
          lastName: dto.lastName,
          birthday: dto.birthday,
          biography: '',
          hash,
        },
      });
      if (process.env.NODE_ENV === 'test') return;
      const activationToken = await this.generateActivationToken(user);
      await this.mailer.sendMail({
        to: user.email,
        from: 'hostyourportfolio@gmail.com',
        subject: 'Confirma tu correo electronico',
        template: 'verify-email',
        context: {
          username: `${user.firstName} ${user.lastName}`,
          frontendUrl: `${this.config.get('FRONTEND_URL')}/#`,
          activationToken,
        },
      });
      // return nothing
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already taken');
        }
      }
      throw error;
    }
  }

  signToken(userId: string, email: string): Promise<string> {
    const data = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(data, {
      secret,
      expiresIn: '1h',
    });
  }

  async verifyEmail(token: string) {
    const secret = this.config.get('JWT_SECRET_VERIFICATION_EMAIL');
    try {
      const userJwt: { email: string; name: string } =
        await this.jwt.verifyAsync(token, {
          secret,
        });
      const user = await this.prisma.user.findUnique({
        where: {
          email: userJwt.email,
        },
      });
      if (user.isEmailConfirmed === false) {
        await this.prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            isEmailConfirmed: true,
            activeStatus: true,
          },
        });
      } else {
        const error = new Error('Email already confirmed');
        error.name = 'EmailAlreadyConfirmed';
        throw error;
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      } else if (error.name === 'EmailAlreadyConfirmed') {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) return;
      if (user.isEmailConfirmed === false) {
        if (process.env.NODE_ENV === 'test') return;
        const activationToken = await this.generateActivationToken(user);
        await this.mailer.sendMail({
          to: email,
          from: 'hostyourportfolio@gmail.com',
          subject: 'Confirma tu correo electronico',
          template: 'verify-email',
          context: {
            username: `${user.firstName} ${user.lastName}`,
            frontendUrl: `${this.config.get('FRONTEND_URL')}/#`,
            activationToken,
          },
        });
      } else {
        const error = new Error('Email already confirmed');
        error.name = 'EmailAlreadyConfirmed';
        throw error;
      }
    } catch (error) {
      if (error.name === 'EmailAlreadyConfirmed') {
        throw new BadRequestException(error.message);
      }
    }
  }

  generateActivationToken(user: User | AuthDto): Promise<string> {
    const data = {
      email: user.email,
      name: user.firstName + user.lastName,
    };
    const secret = this.config.get('JWT_SECRET_VERIFICATION_EMAIL');
    return this.jwt.signAsync(data, {
      secret,
      expiresIn: '1d',
    });
  }
}
