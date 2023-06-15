import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/role/role.enum';
import { Roles } from '../auth/role/roles.decorator';
import { JwtAuthGuard } from '../auth/authStrategy/jwt-auth.guards';
import { RolesGuard } from '../auth/role/role.guard';
import { UpdateUserDtoAdmin } from './dto/update-user.dtoAdmin';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return this.userService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    const result = await this.userService.findAll();
    result.map((user) => delete user.password);
    return result;
  }

  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    const result =
      await this.userService.findOneWithWishListAndLibrariesVolumes(+id);
    delete result.password;
    return result;
  }

  @Patch('updateProfile')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    updateUserDto.password = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : undefined;
    return this.userService.update(+req.user.id, updateUserDto);
  }

  @Delete('deleteProfile')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteUser(@Request() req) {
    return this.userService.remove(+req.user.id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateUserDtoAdmin: UpdateUserDtoAdmin,
  ) {
    updateUserDtoAdmin.password = updateUserDtoAdmin.password
      ? await bcrypt.hash(updateUserDtoAdmin.password, 10)
      : undefined;
    return this.userService.update(+id, updateUserDtoAdmin);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
