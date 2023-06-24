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
import { ClientAuthGuard } from 'src/auth/guards/client-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { roles } from 'src/common/types';
import { Roles } from 'src/common/decorators/roles.decorator';

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
    if (updateUserDto.name == undefined || updateUserDto.name.trim() == '') {
      throw { message: 'Invalid data', statusCode: HttpStatus.BAD_REQUEST };
    }

    return await this.userService.update(req.user.userId, updateUserDto);
  }
}
