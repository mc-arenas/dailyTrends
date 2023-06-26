import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async findUserByEmail(email: string): Promise<User> {
    return await this.UserModel.findOne({ email, active: true }).exec();
  }

  async registerUser(registerAuthDto: RegisterAuthDto): Promise<User> {
    const createdUser = await this.UserModel.create(registerAuthDto);
    return createdUser;
  }
}
