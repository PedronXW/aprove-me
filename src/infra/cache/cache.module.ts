import { CacheRepository } from '@/domain/application/cache/cache-repository'
import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { RedisCacheRepository } from './redis-repository'
import { RedisService } from './redis.service'

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
