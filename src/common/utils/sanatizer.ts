import { User } from 'src/src/users/entities/user.entity';

export function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password: _, ...sanatizedUser } = user;
  return sanatizedUser;
}
