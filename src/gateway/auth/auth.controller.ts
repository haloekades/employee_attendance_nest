import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authClient: AuthClientService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authClient.login(loginDto);
  }
}
