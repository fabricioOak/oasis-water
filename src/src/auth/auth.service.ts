import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async login(loginAuthDto: LoginAuthDto) {
    const { password, username } = loginAuthDto;

    if (!username || !password) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findOne({
      username,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Login successfully',
      accessToken: this.createToken(user),
    };
  }

  private createToken(user: User) {
    return this.jwtService.sign({
      sub: user._id?.toString(),
      username: user.username,
      role: user.role,
    });
  }
}
