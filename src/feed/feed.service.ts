import { Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { Feed } from './schemas/feed.schema';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IDeleteResult } from 'src/common/types';


@Injectable()
export class FeedService {
  constructor(@InjectModel(Feed.name) private FeedModel: Model<Feed>) {}

  create(createFeedDto: CreateFeedDto): Promise<Feed> {
    return this.FeedModel.create(createFeedDto);
  }

  async update(feedId: string, updateFeedDto: UpdateFeedDto): Promise<UpdateWriteOpResult> {
    return this.FeedModel.updateOne({_id: feedId}, updateFeedDto).exec();
  }

  async findOne(id: string): Promise<Feed> {
    return this.FeedModel.findOne({ _id: id }).exec();
  }

  async findOneByNewId(newId: string): Promise<Feed> {
    return this.FeedModel.findOne({ newId }).exec();
  }

  async findAll(): Promise<Feed[]> {
    return this.FeedModel.find().exec();
  }

  remove(id: string) : Promise<IDeleteResult> {
    return this.FeedModel.deleteOne({ _id: id }).exec();
  }
}
