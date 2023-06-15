import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Role } from '../auth/role/role.enum';
import { RolesGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/role/roles.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './authStrategy/jwt-auth.guards';
import { LocalAuthGuard } from './authStrategy/local-auth.guard';
import { UserService } from '../user/user.service';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/profil')
  getProfile(@Request() req) {
    return this.userService.findOneWithWishListAndLibrariesVolumes(req.user.id);
  }
}
