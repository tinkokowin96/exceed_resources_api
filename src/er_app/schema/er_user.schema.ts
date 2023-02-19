import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Bank } from 'src/bank/schema/bank.schema';
import { UserSchema } from 'src/common/schema/user.shema';
import { Permission } from 'src/permission/permission.schema';

@Schema()
export class ErUser extends UserSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  position: string;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  active: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  superAdmin: boolean;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Permission' })
  @ValidateNested()
  @Type(() => Permission)
  permission: Permission;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Bank' })
  @ValidateNested()
  @Type(() => Bank)
  bank: Bank;
}

export const ErUserSchema = SchemaFactory.createForClass(ErUser);

ErUserSchema.pre('save', function (next) {
  this.password = hashSync(this.password, 12);
  next();
});
