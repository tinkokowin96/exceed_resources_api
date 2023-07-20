import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EField } from '../util/enumn';
import { CoreSchema } from './core.shema';

@Schema()
export class Field extends CoreSchema {
	@Prop({ type: String, required: true })
	@IsNotEmpty()
	@IsString()
	name: string;

	@Prop({ type: String, enum: EField, default: EField.String })
	@IsEnum(EField)
	type: EField;

	@Prop({ type: Boolean, default: false })
	@IsBoolean()
	list: boolean;

	@Prop({ type: Boolean, default: false })
	@IsBoolean()
	mandatory: boolean;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
