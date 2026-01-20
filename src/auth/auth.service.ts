import bcrypt from 'node_modules/bcryptjs';
import { SignInDto } from './dto/signin-dto';
import { 
  HttpStatus, 
  Injectable, 
  HttpException, 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

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
          statusCode: HttpStatus.UNAUTHORIZED,
          icon: 'error',
          error: [],
        };
      };
      
      const passwordCompare = bcrypt.compareSync(signInDto.password, user.password);
      if (!passwordCompare) {
        return {
          message: 'Usuario y/o contraseña incorrectos.',
          statusCode: HttpStatus.UNAUTHORIZED,
          icon: 'error',
          error: [],
        };
      };

      const payload = { email: signInDto.email, name: user.rol, school: user.school, sub: user.id, rol: user.rol };
      const token = await this.jwtService.signAsync(payload);

      return {
        message: 'Login éxitoso.',
        statusCode: HttpStatus.CREATED,
        icon: 'success',
        error: '',
        data: {
          token,
          rol: user.rol
        }
      };
    } catch (error) {
      throw new HttpException({
        message: 'Error al ejecutar esta acción.',
        icon: 'error',
        error: [error],
        statusCode: HttpStatus.UNAUTHORIZED,
      }, HttpStatus.UNAUTHORIZED);
    };
  };
}
