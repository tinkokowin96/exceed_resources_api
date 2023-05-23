import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ChatMessage } from './chat_message.shema';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class DirectMessage extends CoreSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  messagedUser: User;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'ChatMessage' }] })
  messages: ChatMessage[];
}

export const DirectMessageSchema = SchemaFactory.createForClass(DirectMessage);
