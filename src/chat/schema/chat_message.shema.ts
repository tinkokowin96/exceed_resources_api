import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Message } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class ChatMessage extends CoreSchema {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Message)
  message: Message[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  sendBy: User;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
