import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateWriteOpResult> {
    return this.UserModel.updateOne({_id: userId}, updateUserDto).exec();
  }

  async findOne(id: string): Promise<User> {
    return this.UserModel.findOne({ _id: id }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }
}
