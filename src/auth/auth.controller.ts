import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { type LoginDto, loginSchema } from './dto/login.dto';
import { type Response } from 'express';
import { AuthGuard } from './auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { type IUser } from './auth.inferface';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  login(
    @Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getCurrentUser(@User() user: IUser) {
    return this.usersService.findById(user.id);
  }
}
