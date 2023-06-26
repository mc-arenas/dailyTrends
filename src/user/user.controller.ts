import {
  Controller,
  Get,
  Request,
  Param,
  UseGuards,
  Put,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ClientAuthGuard } from '../auth/guards/client-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { roles } from '../common/types';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ClientAuthGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(ClientAuthGuard)
  @Roles(roles.client)
  @Get('me')
  async findMe(@Request() req) {
    return await this.userService.findOne(req.user.userId);
  }

  @UseGuards(ClientAuthGuard)
  @Get(':id')
  async findOne(@Param('id') userId: string) {
    return await this.userService.findOne(userId);
  }

  @UseGuards(ClientAuthGuard)
  @Put()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(req.user.userId, updateUserDto);
  }
}
