import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { roles } from '../common/types';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { PassportModule } from '@nestjs/passport';
import { HttpException, HttpStatus } from '@nestjs/common';

const newId: string = faker.string.uuid();
const email: string = faker.internet.email();
const validAccessToken: string = faker.string.alphanumeric(50);
const user1: User = {
  name: faker.string.sample(),
  role: faker.helpers.enumValue(roles),
  password: faker.string.alphanumeric(),
  active: true,
  email,
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: process.env.JWT_SECRET || 'secretKey',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            findUserByEmail: jest.fn().mockImplementationOnce((email: string) =>
              Promise.resolve({
                _id: faker.string.uuid(),
                ...user1,
              }),
            ),
            register: jest
              .fn()
              .mockImplementation((user: RegisterAuthDto) =>
                Promise.resolve({ _id: newId, ...user }),
              ),
          },
        },
        { provide: getModelToken(User.name), useValue: jest.fn() },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('login', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should not get log in (pass error)', () => {
      const loginDto: LoginAuthDto = {
        email,
        password: faker.string.sample(8),
      };

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      expect(controller.login(loginDto)).rejects.toThrowError(
        new HttpException('Invalid password', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('register', () => {
    it('should not get register: user not foun', () => {
      const dto: RegisterAuthDto = {
        name: faker.string.sample(),
        role: faker.helpers.enumValue(roles),
        email: faker.internet.email(),
        password: faker.string.sample(8),
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(false));

      expect(controller.register(dto)).rejects.toThrowError(
        new HttpException(
          'Invalid data: email already registered',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
