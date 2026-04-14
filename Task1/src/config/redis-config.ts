import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async () => {
    const store = await redisStore({
      url: 'redis://default:n5m7gbzrjKqYDl1vZ9G4VonGhVnyAa0w@redis-13002.crce182.ap-south-1-1.ec2.cloud.redislabs.com:13002',
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
