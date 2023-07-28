import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto, resendVerificationEmailDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
  @Post('signin')
  @HttpCode(200)
  signin(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Post('verify_email/:token')
  @HttpCode(200)
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }
  @Post('resend_verification_email')
  @HttpCode(200)
  resendVerificationEmail(@Body() user: resendVerificationEmailDto) {
    return this.authService.resendVerificationEmail(user.email);
  }
}
