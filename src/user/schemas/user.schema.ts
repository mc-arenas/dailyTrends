import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  role: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ default: true})
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);