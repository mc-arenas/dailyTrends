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
import { Logger } from '../Logger';

@Controller('auth')
export class AuthController {
  private logger: Logger;

  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger();
  }

  @Post('login')
  @UseGuards(NoAuthGuard)
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      // get user and check email
      const user = await this.authService.findUserByEmail(loginAuthDto.email);
      if (user === null) {
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

      this.logger.add(`Logging user ... ${user.email} at ${new Date()}`);
      return {
        access_token: this.jwtService.sign({
          //@ts-ignore
          id: user._id.toString(),
          role: user.role,
        }),
      };
    } catch (error) {
      const throwError = new HttpException(
        error.message || 'Internal server error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
      this.logger.add(
        `ERROR logging user ... ${throwError.message} at ${new Date()}`,
      );
      throw throwError;
    }
  }

  @Post('register')
  @UseGuards(NoAuthGuard)
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    try {
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

      this.logger.add(
        `Registering ${registerAuthDto.role} user ... ${
          registerAuthDto.email
        } at ${new Date()}`,
      );
      user = await this.authService.registerUser(registerAuthDto);

      const access_token = this.jwtService.sign({
        //@ts-ignore
        id: user._id.toString(),
        role: user.role,
      });

      return {
        access_token,
      };
    } catch (error) {
      const throwError = new HttpException(
        error.message || 'Internal server error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
      this.logger.add(
        `ERROR registering user ... ${throwError.message} at ${new Date()}`,
      );
      throw throwError;
    }
  }
}
