import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IUser, UserRoles, UserStatus } from '../interfaces/user.interface';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class User implements IUser {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ type: [String], enum: UserRoles, default: [UserRoles.USER] })
  roles: UserRoles[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
