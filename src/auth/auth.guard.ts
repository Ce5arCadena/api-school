import { 
  HttpStatus, 
  Injectable, 
  CanActivate,
  HttpException,
  ExecutionContext,
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ISPUBLICKEY } from "./decorator";

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {};

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(ISPUBLICKEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException({
        message: 'No está autorizado.',
        status: HttpStatus.UNAUTHORIZED,
        icon: 'error',
        errors: [],
      }, HttpStatus.UNAUTHORIZED);
    };

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY
      });

      request.userAuth = payload;
      return true;
    } catch (error) {
      throw new HttpException({
        message: 'No está autorizado.',
        status: HttpStatus.UNAUTHORIZED,
        icon: 'error',
        errors: [],
      }, HttpStatus.UNAUTHORIZED);
    };
  };

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}