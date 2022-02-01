import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { genSaltSync, hashSync } from 'bcrypt';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
    set: (value: string) => hashSync(value, genSaltSync(10)),
  })
  password: string;

  @Prop({ default: true })
  active: string;

  @Prop({ type: Object, default: {} })
  options: any;

  @Prop({ type: Object, default: undefined })
  acl: any;

  @Prop({
    type: [String],
    default: [process.env.ACL_DEFAULT_PROFILE || '61f8338aa999c753bfe21a57'],
    ref: 'Profile',
  })
  profiles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('find', function () {
  if (!this._mongooseOptions.populate) {
    this.populate('profiles', '-_id name rule');
  }
});

UserSchema.pre('findOne', function () {
  if (!this._mongooseOptions.populate) {
    this.populate('profiles', '-_id name rule');
  }
});

UserSchema.pre('findOneAndUpdate', function () {
  this.populate('profiles', '-_id name rule');
});
