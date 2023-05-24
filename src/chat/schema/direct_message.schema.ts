import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Chat } from './chat.schema';
import { ChatMessage } from './chat_message.shema';

@Schema()
export class DirectMessage extends Chat {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  messagedUser: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'ChatMessage' })
  lastMessage: ChatMessage;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'ChatMessage' }] })
  messages: ChatMessage[];
}

export const DirectMessageSchema = SchemaFactory.createForClass(DirectMessage);
