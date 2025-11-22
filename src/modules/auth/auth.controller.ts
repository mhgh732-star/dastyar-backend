import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto, LogoutDto } from './dto/refresh-token.dto';
import { EnableMfaDto, VerifyMfaDto } from './dto/mfa.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      role: dto.role,
    });
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login({ email: dto.email, password: dto.password, otp: dto.otp });
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const user = await this.authService.me(req.user.userId);
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/enable')
  async enableMfa(@Req() req: any, @Body() _dto: EnableMfaDto) {
    return this.authService.enableMfa(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify')
  async verifyMfa(@Req() req: any, @Body() dto: VerifyMfaDto) {
    return this.authService.verifyMfa(req.user.userId, dto.code);
  }

  @Post('logout')
  async logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@Req() req: any) {
    return this.authService.logoutAll(req.user.userId);
  }
}
