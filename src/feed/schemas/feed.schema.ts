import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeedDocument = HydratedDocument<Feed>;

@Schema()
export class Feed {
  @Prop()
  title: string;

  @Prop()
  subtitle: string;

  @Prop()
  context: string;

  @Prop({ unique: true })
  originalUrl: string;

  @Prop()
  newspaper: string;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
