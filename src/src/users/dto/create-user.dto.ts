import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  name: string;
  username: string;
  phone: string;
  password: string;
  role: UserRole;
  poolIds: string[];
  status: UserStatus;
}
