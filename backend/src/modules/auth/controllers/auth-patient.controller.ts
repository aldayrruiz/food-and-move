import { SkipAuth } from '@modules/auth/constants';
import { SignInPatientDto } from '@modules/auth/dto/sign-in-patient.dto';
import { SignUpPatientDto } from '@modules/auth/dto/sign-up-patient.dto';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtRefreshGuard } from '@shared/guards/jwt-refresh.guard';
import { Request } from 'express';
import { AuthPatientService } from '../services/auth-patient.service';
import {Roles} from "@modules/auth/roles.decorator";
import {Role} from "@modules/auth/enums/role.enum";

@ApiTags('auth')
@Controller('auth/patient')
export class AuthPatientController {
  constructor(private readonly authService: AuthPatientService) {}

  @Roles(Role.Admin)
  @Post('signUp')
  signUp(@Body() signUpDto: SignUpPatientDto) {
    return this.authService.signUp(signUpDto);
  }

  @SkipAuth()
  @Post('signIn')
  async loginPatient(@Body() authEmployeeDto: SignInPatientDto) {
    return await this.authService.signIn(authEmployeeDto);
  }

  @Get('logOut')
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['sub']);
  }

  @SkipAuth()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
