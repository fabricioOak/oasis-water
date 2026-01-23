import { User } from 'src/src/users/entities/user.entity';

export type PublicUser = Omit<User, 'password'>;
