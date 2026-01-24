import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from './entities/booking.entity';
import { Model } from 'mongoose';
import { PaginatedResponse, PaginationDto } from 'src/common/types/paginated';
import { FilterByMonthDto } from './dto/get-filter-by-month.dto';

import { startOfMonth, endOfMonth, getDay } from 'date-fns';
import { Pool, PoolDocument, PoolStatus } from '../pool/entities/pool.entity';
import { User, UserDocument } from '../users/entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Pool.name) private poolModel: Model<PoolDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
    const { pool, date, startTime, endTime } = createBookingDto;

    await this.validateBooking(pool, date, startTime, endTime);

    const existingEmployee = await this.userModel
      .findById(createBookingDto.employee)
      .exec();

    if (!existingEmployee) {
      throw new HttpException(
        'This employee does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const newBooking = await this.bookingModel.create(createBookingDto);

    return {
      message: 'Booking created successfully',
      data: newBooking.toObject(),
    };
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Booking[]>> {
    const { limit = 10, page = 1 } = paginationDto;
    const skip = (page - 1) * limit;
    const [items, count] = await Promise.all([
      this.bookingModel.find().skip(skip).limit(limit).lean().exec(),
      this.bookingModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(count / limit);

    return {
      meta: {
        count,
        page,
        limit,
        totalPages,
      },
      items,
    };
  }

  async findByMonth(filterByMonthDto: FilterByMonthDto) {
    const { month, year } = filterByMonthDto;
    const date = new Date(year, month - 1);

    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    const [items, count] = await Promise.all([
      this.bookingModel
        .find({
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .populate([
          { path: 'employee', select: ['name', 'phone'] },
          { path: 'pool', select: ['-employees'] },
        ])
        .lean()
        .exec(),
      this.bookingModel
        .countDocuments({
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .exec(),
    ]);

    return {
      items,
      count,
    };
  }

  async findOne(id: string) {
    const booking = await this.bookingModel.findById(id).lean().exec();

    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Booking found successfully',
      data: booking,
    };
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const existingBooking = await this.bookingModel.findById(id);

    if (!existingBooking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }

    if (
      updateBookingDto.pool ||
      updateBookingDto.date ||
      updateBookingDto.startTime ||
      updateBookingDto.endTime
    ) {
      const poolId = updateBookingDto.pool || existingBooking.pool;
      const date = updateBookingDto.date || existingBooking.date;
      const startTime = updateBookingDto.startTime || existingBooking.startTime;
      const endTime = updateBookingDto.endTime || existingBooking.endTime;

      await this.validateBooking(poolId, date, startTime, endTime);
    }

    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, { ...updateBookingDto }, { new: true })
      .lean()
      .exec();

    if (!updatedBooking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Booking updated successfully',
      data: updatedBooking,
    };
  }

  async remove(id: string) {
    const booking = await this.bookingModel.findByIdAndDelete(id).exec();

    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Booking deleted successfully',
    };
  }

  private async validateBooking(
    poolId: string,
    date: Date,
    startTime: Date,
    endTime: Date,
  ) {
    const existingPool = await this.poolModel.findById(poolId).exec();

    if (!existingPool) {
      throw new HttpException('This pool does not exist', HttpStatus.NOT_FOUND);
    }

    if (existingPool.status !== PoolStatus.ACTIVE) {
      throw new HttpException(
        'This pool is not available for booking',
        HttpStatus.BAD_REQUEST,
      );
    }

    const bookingDate = new Date(date);
    const dayOfWeek = getDay(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!existingPool.availableDays.includes(dayOfWeek)) {
      throw new HttpException(
        'This pool is not available on the selected day',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (new Date(date) < today) {
      throw new HttpException(
        'Cannot create bookings for past dates',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.hasTimeConflict(existingPool, date, startTime, endTime);
  }

  private async hasTimeConflict(
    pool: Pool,
    date: Date,
    startTime: Date,
    endTime: Date,
  ) {
    if (startTime >= endTime) {
      throw new HttpException(
        'End time must be after start time',
        HttpStatus.BAD_REQUEST,
      );
    }

    const conflictingBooking = await this.bookingModel
      .findOne({
        pool: pool._id,
        date: date,
        $or: [
          // New booking starts during an existing booking
          {
            startTime: { $lte: startTime },
            endTime: { $gt: startTime },
          },
          //  New booking ends during an existing booking
          {
            startTime: { $lt: endTime },
            endTime: { $gte: endTime },
          },
          //  New booking encompasses an existing booking
          {
            startTime: { $gte: startTime },
            endTime: { $lte: endTime },
          },
        ],
      })
      .exec();

    if (conflictingBooking) {
      throw new HttpException(
        'There is already a booking for this pool at the selected time',
        HttpStatus.CONFLICT,
      );
    }
  }
}
