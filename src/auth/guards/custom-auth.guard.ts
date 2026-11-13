import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Public_Key } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      Public_Key,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
