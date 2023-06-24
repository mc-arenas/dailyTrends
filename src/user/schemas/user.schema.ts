import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { roles } from 'src/common/types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  role: roles;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ default: true})
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);