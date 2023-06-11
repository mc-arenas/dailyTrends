import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NoAuthGuard } from './guards/no-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(NoAuthGuard)
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      if (
        loginAuthDto.email == undefined ||
        loginAuthDto.email.trim() == '' ||
        loginAuthDto.password == undefined ||
        loginAuthDto.password.trim() == '' ||
        loginAuthDto.password.length <= 7
      ) {
        throw { message: 'Invalid data', statusCode: HttpStatus.BAD_REQUEST };
      }

      // check email
      const user = await this.authService.findUserByEmail(loginAuthDto.email);
      if (user == null) {
        throw { message: 'Not found user', statusCode: HttpStatus.NOT_FOUND };
      }

      const isValidPassword = await bcrypt.compare(
        loginAuthDto.password,
        user.password,
      );
      if (!isValidPassword) {
        throw {
          message: 'Invalid password',
          statusCode: HttpStatus.UNAUTHORIZED,
        };
      }

      return {
        access_token: this.jwtService.sign({
          //@ts-ignore
          id: user._id.toString(),
          role: user.role,
        }),
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  @UseGuards(NoAuthGuard)
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    try {
      if (
        registerAuthDto.email == undefined ||
        registerAuthDto.email.trim() == '' ||
        registerAuthDto.password == undefined ||
        registerAuthDto.password.trim() == '' ||
        registerAuthDto.password.length <= 7 ||
        registerAuthDto.role == undefined ||
        registerAuthDto.role.trim() == '' ||
        registerAuthDto.name == undefined ||
        registerAuthDto.name.trim() == ''
      ) {
        throw { message: 'Invalid data', statusCode: HttpStatus.BAD_REQUEST };
      }

      // check email
      let user = await this.authService.findUserByEmail(registerAuthDto.email);
      if (user != null) {
        throw {
          message: 'Invalid data: email already registered',
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      // register user
      registerAuthDto.password = await bcrypt.hash(
        registerAuthDto.password,
        10,
      );
      user = await this.authService.registerUser(registerAuthDto);
      //@ts-ignore
      console.log('DD');

      const access_token = this.jwtService.sign({
        //@ts-ignore
        id: user._id.toString(),
        role: user.role,
      });

      return {
        access_token
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
