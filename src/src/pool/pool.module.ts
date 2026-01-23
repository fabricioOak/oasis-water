import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolController } from './pool.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pool, PoolSchema } from './entities/pool.entity';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pool.name,
        schema: PoolSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [PoolController],
  providers: [PoolService],
})
export class PoolModule {}
