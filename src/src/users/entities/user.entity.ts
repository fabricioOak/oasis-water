import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MAINTAINER = 'MAINTAINER',
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  _id?: string;

  @Prop()
  name: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop()
  role: UserRole;

  @Prop()
  poolIds: string[];

  @Prop({ default: UserStatus.INACTIVE })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
