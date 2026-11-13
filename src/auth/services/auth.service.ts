import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtTokenPayload } from '../models/jwt-token-payload.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findForAuth(username);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  generateJwt(user: User) {
    const payload: JwtTokenPayload = {
      username: user.username,
      role: user.role.name,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
