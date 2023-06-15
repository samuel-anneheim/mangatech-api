import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, roles: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
