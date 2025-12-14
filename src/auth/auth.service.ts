import bcrypt from 'node_modules/bcryptjs';
import { SignInDto } from './dto/signin-dto';
import { 
  HttpStatus, 
  Injectable, 
  HttpException, 
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ){};

  async signIn(signInDto: SignInDto): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(signInDto.email);
      if (!user) {
        return {
          message: 'Usuario y/o contraseña incorrectos.',
          status: HttpStatus.UNAUTHORIZED,
          icon: 'error',
          errors: [],
        };
      };
      
      const passwordCompare = bcrypt.compareSync(signInDto.password, user.password);
      if (!passwordCompare) {
        return {
          message: 'Usuario y/o contraseña incorrectos.',
          status: HttpStatus.UNAUTHORIZED,
          icon: 'error',
          errors: [],
        };
      };

      const payload = { email: signInDto.email, name: user.rol, school: user.school, sub: user.id };
      const token = await this.jwtService.signAsync(payload);

      return {
        message: 'Login éxitoso.',
        status: HttpStatus.CREATED,
        icon: 'success',
        data: {
          token
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al ejecutar esta acción.',
        icon: 'error',
        errors: [error],
        status: HttpStatus.UNAUTHORIZED,
      }, HttpStatus.UNAUTHORIZED);
    };
  };
}
