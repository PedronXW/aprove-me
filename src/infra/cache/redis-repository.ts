import { CacheRepository } from '@/domain/application/cache/cache-repository'
import { createRedisInstance, quitRedisInstance } from './redis-instance'

export class RedisCacheRepository implements CacheRepository {
  async set(key: string, value: string): Promise<void> {
    const redis = createRedisInstance()

    await redis.set(key, value, 'EX', 60 * 60 * 2) // 2 hours

    quitRedisInstance(redis)
  }

  async get(key: string): Promise<string | null> {
    const redis = createRedisInstance()

    const value = await redis.get(key)

    quitRedisInstance(redis)

    return value
  }
}
