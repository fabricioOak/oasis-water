import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PoolDocument = HydratedDocument<Pool>;

export enum PoolStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

@Schema({ timestamps: true })
export class Pool {
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  capacity: number;

  @Prop()
  pricePerDay: number;

  @Prop()
  availableDays: number[]; // 0 (Sunday) to 6 (Saturday)

  @Prop()
  description: string;

  @Prop()
  imageUrl?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  employees: string[];

  @Prop({
    type: String,
    enum: Object.values(PoolStatus),
    required: true,
    default: PoolStatus.ACTIVE,
  })
  status: PoolStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PoolSchema = SchemaFactory.createForClass(Pool);
