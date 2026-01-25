import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { PaginatedResponse, PaginationDto } from 'src/common/types/paginated';
import { PublicUser } from 'src/common/types/users';
import { sanitizeUser } from 'src/common/utils/sanatizer';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: PublicUser }> {
    const usernameAlreadyInUse = await this.userModel.findOne({
      username: createUserDto.username,
    });

    if (usernameAlreadyInUse) {
      throw new HttpException('Username already in use', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const newUser = await this.userModel.create(createUserDto);

    const userWithoutPassword = sanitizeUser(newUser.toObject());
    return {
      message: 'User created successfully',
      data: userWithoutPassword,
    };
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<PublicUser[]>> {
    const { limit = 10, page = 1 } = paginationDto;
    const skip = (page - 1) * limit;
    const [items, count] = await Promise.all([
      this.userModel
        .find()
        .select('-password')
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.userModel.countDocuments().exec(),
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
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const userWithoutPassword = sanitizeUser(user);
    return {
      message: 'User found',
      data: userWithoutPassword,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const existingUser = await this.userModel.findOne({
        username: updateUserDto.username,
        _id: { $ne: id },
      });

      if (existingUser) {
        throw new HttpException('Username already in use', HttpStatus.CONFLICT);
      }
    }

    const userToUpdate = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .lean()
      .exec();

    if (!userToUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userWithoutPassword = sanitizeUser(userToUpdate);
    return {
      message: 'User updated successfully',
      data: userWithoutPassword,
    };
  }

  async remove(id: string) {
    const userToDelete = await this.userModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!userToDelete) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'User deleted successfully',
    };
  }
}
