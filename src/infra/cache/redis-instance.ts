import { Redis } from 'ioredis'
import { env } from '../env'

const createRedisInstance = () => {
  const redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: env.NODE_ENV === 'test' ? 9 : 0,
  })

  redisClient.on('error', (error) => {
    console.error(error)
  })

  return redisClient
}

const quitRedisInstance = (redisInstance) => {
  redisInstance.quit()
}

export { createRedisInstance, quitRedisInstance }
