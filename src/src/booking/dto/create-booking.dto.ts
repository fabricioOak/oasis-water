import {
  IsString,
  IsNumber,
  IsEmail,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ example: '6973d74b1d60cfba7467e510' })
  @IsString()
  pool: string;

  @ApiProperty({ example: '69729d5b551bf5d906bcdb82' })
  @IsString()
  employee: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  clientName: string;

  @ApiProperty({ example: '+55 81 99999-9999' })
  @IsString()
  clientPhone: string;

  @ApiPropertyOptional({ example: 'joao.silva@email.com' })
  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @ApiProperty({ example: '2026-02-15' })
  @IsDateString()
  date: Date;

  @ApiProperty({ example: '2026-02-15T10:00:00.000Z' })
  @IsDateString()
  startTime: Date;

  @ApiProperty({ example: '2026-02-15T18:00:00.000Z' })
  @IsDateString()
  endTime: Date;

  @ApiProperty({ example: 300.0, minimum: 0 })
  @IsNumber()
  @Min(0)
  totalValue: number;

  @ApiProperty({ example: 150.0, minimum: 0 })
  @IsNumber()
  @Min(0)
  paidValue: number;

  @ApiPropertyOptional({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ example: 'Reserva para festa de aniversário' })
  @IsOptional()
  @IsString()
  notes?: string;
}
