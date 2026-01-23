import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PoolStatus } from '../entities/pool.entity';

export class UpdatePoolStatusDto {
  @ApiProperty({
    enum: PoolStatus,
    example: PoolStatus.ACTIVE,
    description: 'Pool status',
  })
  @IsEnum(PoolStatus)
  status: PoolStatus;
}
