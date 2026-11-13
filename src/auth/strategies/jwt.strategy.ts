import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/users/services/user.service';
import { JwtTokenPayload } from '../models/jwt-token-payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'violetLilium.jwtSecret',
      ) as string,
    });
  }

  async validate(payload: JwtTokenPayload): Promise<JwtTokenPayload> {
    try {
      await this.userService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException('User no longer exists');
    }
    return payload;
  }
}
