import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/core/schema/core.shema';
import { ChatMessage } from './chat_message.shema';

@Schema()
export class Chat extends CoreSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'ChatMessage' })
  lastMessage: ChatMessage;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'ChatMessage' }] })
  unreadMessages: ChatMessage[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'ChatMessage' }] })
  messages: ChatMessage[];
}
