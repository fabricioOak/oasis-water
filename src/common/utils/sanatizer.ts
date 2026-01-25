import { User } from 'src/src/users/entities/user.entity';
import { PublicUser } from '../types/users';

export function sanitizeUser(user: User): PublicUser {
  const { password: _p, username: _u, ...sanatizedUser } = user;
  return sanatizedUser;
}
