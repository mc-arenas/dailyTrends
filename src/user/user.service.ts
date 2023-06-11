import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  // TODO update by userId
  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = new this.UserModel(updateUserDto);
    return updatedUser.save();
  }

  async findOne(id: string): Promise<User> {
    return this.UserModel.findOne({ _id: id }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }
}
