import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Feed } from './schemas/feed.schema';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { faker } from '@faker-js/faker';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

// data
const feed1: Feed & { _id: string } = {
  title: faker.string.sample(20),
  subtitle: faker.string.sample(40),
  context: faker.string.sample(80),
  originalUrl: faker.string.uuid(),
  newspaper: faker.string.sample(8),
  _id: faker.string.uuid(),
};

const feed2: Feed & { _id: string } = {
  title: faker.string.sample(20),
  subtitle: faker.string.sample(40),
  context: faker.string.sample(80),
  originalUrl: faker.string.uuid(),
  newspaper: faker.string.sample(8),
  _id: faker.string.uuid(),
};

const newId: string = faker.string.sample();

describe('Feed Controller', () => {
  let controller: FeedController;
  let service: FeedService;

  const removeOneFn = jest.fn();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      imports: [
        JwtModule.register({
          secretOrPrivateKey: process.env.JWT_SECRET || 'secretKey',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        {
          provide: FeedService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([feed1, feed2]),
            findOneByOriginalUrl: jest
              .fn()
              .mockImplementation((id: string, url: string) =>
                Promise.resolve(null),
              ),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                title: feed1.title,
                subtitle: feed1.subtitle,
                context: feed1.context,
                originalUrl: feed1.originalUrl,
                newspaper: feed1.newspaper,
                _id: id,
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((feed: CreateFeedDto) =>
                Promise.resolve({ _id: newId, ...feed }),
              ),
            update: jest.fn().mockImplementation((feed: UpdateFeedDto) =>
              Promise.resolve({
                acknowledged: true,
                modifiedCount: 1,
                upsertedId: null,
                upsertedCount: 0,
                matchedCount: 1,
              }),
            ),
            remove: removeOneFn.mockResolvedValue({
              acknowledged: true,
              deletedCount: 1,
            }),
          },
        },
        { provide: getModelToken(Feed.name), useValue: jest.fn() },
      ],
    }).compile();

    controller = module.get<FeedController>(FeedController);
    service = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFeeds', () => {
    it('should get an array of feeds', () => {
      expect(controller.findAll()).resolves.toEqual([feed1, feed2]);
    });
  });
  describe('getById', () => {
    it('should get a single feed', () => {
      expect(controller.findOne(feed1._id)).resolves.toEqual({
        ...feed1,
      });
    });
  });
  describe('newFeed', () => {
    it('should create a new feed', () => {
      const newFeedDTO: CreateFeedDto = {
        title: faker.string.sample(20),
        subtitle: faker.string.sample(40),
        context: faker.string.sample(80),
        originalUrl: faker.string.uuid(),
        newspaper: faker.string.sample(8),
      };
      expect(controller.create(newFeedDTO)).resolves.toEqual({
        _id: newId,
        ...newFeedDTO,
      });
    });
  });
  describe('updateFeed', () => {
    it('should update a feed', () => {
      const newFeedDTO: UpdateFeedDto = {
        title: faker.string.sample(20),
        subtitle: faker.string.sample(40),
        context: faker.string.sample(80),
      };
      expect(controller.update(feed1._id, newFeedDTO)).resolves.toEqual({
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      });
    });
  });
  describe('deleteFeed', () => {
    it('should return that it deleted a feed', () => {
      expect(controller.remove(feed1._id)).resolves.toEqual({
        acknowledged: true,
        deletedCount: 1,
      });
    });
  });
});
