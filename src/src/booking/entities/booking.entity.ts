import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

@Schema({ timestamps: true })
export class Booking {
  _id?: string;

  @Prop({ type: Types.ObjectId, ref: 'Pool' })
  pool: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  employee: string;

  @Prop()
  clientName: string;

  @Prop()
  clientPhone: string;

  @Prop()
  clientEmail?: string;

  @Prop()
  date: Date;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  totalValue: number;

  @Prop()
  paidValue: number;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    required: true,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Prop()
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
export const BookingSchema = SchemaFactory.createForClass(Booking);
