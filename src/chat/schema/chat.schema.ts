import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';
import { ChatGroup } from './chat_group.shema';
import { DirectMessage } from './direct_message.schema';

@Schema()
export class Chat extends CoreSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  @IsMongoId()
  user: User;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'ChatGroup' }] })
  @IsMongoId({ each: true })
  chatGroups: ChatGroup[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'DirectMessage' }] })
  @IsMongoId({ each: true })
  directMessages: DirectMessage[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
