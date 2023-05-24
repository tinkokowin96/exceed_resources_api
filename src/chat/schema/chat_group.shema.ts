import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Attachment } from 'src/common/schema/common.schema';
import { EChatGroup } from 'src/common/util/enumn';
import { User } from 'src/user/schema/user.schema';
import { Chat } from './chat.schema';
import { ChatMessage } from './chat_message.shema';

class Pin {
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachment: Attachment[];

  @ValidateNested()
  @Type(() => ChatMessage)
  message: ChatMessage;
}

@Schema()
export class ChatGroup extends Chat {
  @Prop({ type: String })
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsString()
  description: string;

  @Prop({ type: String, enum: EChatGroup, required: true })
  @IsNotEmpty()
  @IsEnum(EChatGroup)
  type: EChatGroup;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Pin)
  pins: Pin[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  admins: User[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  members: User[];
}

export const ChatGroupSchema = SchemaFactory.createForClass(ChatGroup);
