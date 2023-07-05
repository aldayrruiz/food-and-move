import { SkipAuth } from '@modules/auth/constants';
import { SignInEmployeeDto } from '@modules/auth/dto/sign-in-employee.dto';
import { SignUpEmployeeDto } from '@modules/auth/dto/sign-up-employee.dto';
import { AuthEmployeeService } from '@modules/auth/services/auth-employee.service';
import { RecoverPasswordDto } from '@modules/employees/dto/recover-password.dto';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '@shared/dto/change-password.dto';
import { JwtRefreshGuard } from '@shared/guards/jwt-refresh.guard';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth/employee')
export class AuthEmployeeController {
  constructor(private readonly authService: AuthEmployeeService) {}

  @Post('signUp')
  signUp(@Body() signUpDto: SignUpEmployeeDto) {
    return this.authService.signUp(signUpDto);
  }

  @SkipAuth()
  @Post('signIn')
  async loginPatient(@Body() authEmployeeDto: SignInEmployeeDto) {
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

  @SkipAuth()
  @Get('forgotPassword/:email')
  async forgotPassword(@Param('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @SkipAuth()
  @Post('recoverPassword')
  async recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return await this.authService.recoverPassword(recoverPasswordDto.token, recoverPasswordDto.password);
  }

  @SkipAuth()
  @Post('change-password/:id')
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(id, changePasswordDto);
  }
}
