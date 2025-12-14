import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { 
  Body, 
  Post,
  Controller, 
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ){};

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
