import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationDto } from 'src/common/types/paginated';
import { FilterByMonthDto } from './dto/get-filter-by-month.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Auth([UserRole.ADMIN])
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Auth([UserRole.ADMIN])
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.bookingService.findAll(paginationDto);
  }

  @Auth([UserRole.ADMIN, UserRole.EMPLOYEE])
  @Get('by-month')
  findByMonth(@Query() filterByMonthDto: FilterByMonthDto) {
    return this.bookingService.findByMonth(filterByMonthDto);
  }

  @Auth([UserRole.ADMIN, UserRole.EMPLOYEE])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Auth([UserRole.ADMIN, UserRole.EMPLOYEE])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Auth([UserRole.ADMIN, UserRole.EMPLOYEE])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}
