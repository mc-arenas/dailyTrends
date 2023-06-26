import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { roles } from '../common/types';
import { UpdateUserDto } from './dto/update-user.dto';

const newId: string = faker.string.uuid();
const email: string = faker.internet.email();
const validAccessToken: string = faker.string.alphanumeric(50);
const user1: User & { _id: string } = {
  name: faker.string.sample(),
  role: faker.helpers.enumValue(roles),
  password: faker.string.alphanumeric(),
  active: true,
  email,
  _id: faker.string.uuid(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([user1]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                ...user1,
                _id: id,
              }),
            ),
            update: jest.fn().mockImplementation((user: UpdateUserDto) =>
              Promise.resolve({
                acknowledged: true,
                modifiedCount: 1,
                upsertedId: null,
                upsertedCount: 0,
                matchedCount: 1,
              }),
            ),
          },
        },
        { provide: getModelToken(User.name), useValue: jest.fn() },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should get an array of users', () => {
      expect(controller.findAll()).resolves.toEqual([user1]);
    });
  });

  describe('getOne', () => {
    it('should get a single feed', () => {
      expect(controller.findOne(user1._id)).resolves.toEqual({
        ...user1,
      });
    });
  });
});
