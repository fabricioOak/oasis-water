import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pool, PoolDocument } from './entities/pool.entity';
import { Model } from 'mongoose';
import { PaginatedResponse, PaginationDto } from 'src/common/types/paginated';
import { User, UserDocument } from '../users/entities/user.entity';
import { UpdatePoolStatusDto } from './dto/update-pool-status.dto';

@Injectable()
export class PoolService {
  constructor(
    @InjectModel(Pool.name) private poolModel: Model<PoolDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async create(createPoolDto: CreatePoolDto) {
    const newPool = await this.poolModel.create(createPoolDto);

    return {
      message: 'Pool created successfully',
      data: newPool,
    };
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Pool[]>> {
    const { limit = 10, page = 1 } = paginationDto;
    const skip = (page - 1) * limit;
    const [items, count] = await Promise.all([
      this.poolModel.find().skip(skip).limit(limit).lean().exec(),
      this.poolModel.countDocuments().exec(),
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

  async findOne(id: string) {
    const pool = await this.poolModel
      .findById(id)
      .populate('employees', '-password')
      .lean()
      .exec();
    if (!pool) {
      throw new HttpException('Pool not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'Pool found',
      data: pool,
    };
  }

  async update(id: string, updatePoolDto: UpdatePoolDto) {
    const poolToUpdate = await this.poolModel
      .findByIdAndUpdate(id, updatePoolDto, { new: true })
      .populate('employees', '-password')
      .lean()
      .exec();

    if (!poolToUpdate) {
      throw new HttpException('Pool not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Pool updated successfully',
      data: poolToUpdate,
    };
  }

  async addEmployee(poolId: string, employeeId: string) {
    const pool = await this.poolModel.findById(poolId).lean().exec();
    if (!pool) {
      throw new HttpException('Pool not found', HttpStatus.NOT_FOUND);
    }

    const employee = await this.userModel.findById(employeeId).lean().exec();
    if (!employee) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isAlreadyAssigned = pool.employees.includes(employeeId);

    if (isAlreadyAssigned) {
      throw new HttpException(
        'Employee already assigned to this pool',
        HttpStatus.CONFLICT,
      );
    }

    pool.employees.push(employeeId);

    await this.poolModel.findByIdAndUpdate(poolId, pool, { new: true });

    return {
      message: 'Employee added to pool successfully',
      data: pool,
    };
  }

  async removeEmployee(poolId: string, employeeId: string) {
    const pool = (await this.findOne(poolId)).data;

    const employeeIndex = pool.employees.findIndex((id) => {
      return id.toString() === employeeId;
    });

    if (employeeIndex === -1) {
      throw new HttpException(
        'Employee not assigned to this pool',
        HttpStatus.NOT_FOUND,
      );
    }

    pool.employees.slice(employeeIndex, 1);

    await this.poolModel.findByIdAndUpdate(poolId, pool, { new: true });

    return {
      message: 'Employee removed successfully',
      pool,
    };
  }

  async updatePoolStatus(poolId: string, dto: UpdatePoolStatusDto) {
    const pool = (await this.findOne(poolId)).data;

    pool.status = dto.status;

    const updatedPool = (await this.update(poolId, pool)).data;

    return {
      message: 'Status changed!',
      data: updatedPool,
    };
  }

  async remove(id: string) {
    const poolToDelete = await this.poolModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!poolToDelete) {
      throw new HttpException('Pool not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Pool deleted successfully',
    };
  }
}
