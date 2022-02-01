import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Profile {
  @Prop({
    required: true,
    unique: true,
  })
  rule: string;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: Object,
    required: true,
    default: {},
  })
  acl: any;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
