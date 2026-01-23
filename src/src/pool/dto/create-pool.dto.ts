import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsOptional,
  Min,
  Max,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PoolStatus } from '../entities/pool.entity';

export class CreatePoolDto {
  @ApiProperty({ example: 'Oasis Pool' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Flowers Street' })
  @IsString()
  address: string;

  @ApiProperty({ example: 50, minimum: 1 })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 150.0, minimum: 0 })
  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: '0 = Sunday, 6 = Saturday',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  availableDays: number[];

  @ApiProperty({ example: 'Heated pool with ocean view' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: ['507f1f77bcf86cd799439011'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  employees?: string[];

  @ApiPropertyOptional({ enum: PoolStatus, default: PoolStatus.ACTIVE })
  @IsOptional()
  @IsEnum(PoolStatus)
  status?: PoolStatus;
}
