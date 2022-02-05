import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { genSaltSync, hashSync } from 'bcrypt';
import { Profile } from './profile.schema';
import * as dayjs from 'dayjs';

export type UserDocument = User & Document;

const { ObjectId } = MongooseSchema.Types;
const { USER_CODE_LENGTH, ACL_DEFAULT_PROFILE, JWT_REFRESH_EXPIRETION } = process.env;
const expireAt = JWT_REFRESH_EXPIRETION ? JWT_REFRESH_EXPIRETION.split(';') : [1, 'd'];

@Schema({
  timestamps: true,
  versionKey: false,
  _id: false,
})
export class Session {
  @Prop({})
  id: string;

  @Prop({
    default: dayjs()
      .add(expireAt[0] as number, expireAt[1] as string)
      .toDate(),
  })
  expireAt: Date;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({
    required: true,
    index: true,
    escape: true,
  })
  name: string;

  @Prop({
    escape: true,
  })
  surname: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    escape: true,
    lowercase: true,
    trim: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
    escape: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
    set: (value: string) => hashSync(value, genSaltSync(10)),
  })
  password: string;

  @Prop({
    select: false,
  })
  forgot: string;

  @Prop({
    select: false,
    default: () => {
      const codeLength = Number(USER_CODE_LENGTH || 6);
      return Math.random().toString().replace('.', '').slice(-codeLength);
    },
  })
  code: string;

  @Prop({
    default: 0,
    select: false,
  })
  codeTry: number;

  @Prop({
    default: 0,
    select: false,
  })
  loginTry: number;

  @Prop({
    default: Date.now,
    select: false,
  })
  lastTry: Date;

  @Prop({
    default: false,
  })
  loginBlocked: boolean;

  @Prop({
    default: false,
  })
  confirmed: boolean;

  @Prop({
    default: true,
  })
  active: boolean;

  @Prop({
    type: Object,
    default: {},
  })
  options: any;

  @Prop({
    type: ObjectId,
    ref: 'companies',
  })
  company: string;

  @Prop({
    type: [ObjectId],
    default: [ACL_DEFAULT_PROFILE || '61f8338aa999c753bfe21a57'],
    ref: 'profiles',
  })
  profiles: string[];

  @Prop({
    type: Session,
    select: false,
  })
  session: Session;

  @Prop({
    type: Object,
    default: undefined,
  })
  acl: object;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('find', function () {
  if (!this._mongooseOptions.populate) {
    this.populate({
      path: 'profiles',
      select: 'name rule',
      model: Profile,
    });
  }
});

UserSchema.pre('findOne', function () {
  if (!this._mongooseOptions.populate) {
    this.populate({
      path: 'profiles',
      select: 'name rule',
      model: Profile,
    });
  }
});

UserSchema.pre('findOneAndUpdate', function () {
  this.populate({
    path: 'profiles',
    select: 'name rule',
    model: Profile,
  });
});
