// dto/filter-by-month.dto.ts
import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterByMonthDto {
  @ApiProperty({
    example: 2,
    minimum: 1,
    maximum: 12,
    description: 'Month (1 = January, 12 = December)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    example: 2026,
    minimum: 2000,
    description: 'Year',
  })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year: number;
}
