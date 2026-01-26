import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserRole {
  ADMIN = 'ADMIN', // Administrator with full access
  EMPLOYEE = 'EMPLOYEE', // Employee with limited access
  GUEST = 'GUEST', // Guest user with minimal access
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id?: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  username: string;

  @Prop({
    trim: true,
  })
  phone: string;

  @Prop({
    required: true,
    minlength: 6,
  })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Prop({
    type: [String],
    default: [],
  })
  poolIds: string[];

  @Prop({
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
