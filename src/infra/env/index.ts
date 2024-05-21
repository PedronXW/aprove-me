import 'dotenv/config'
import { z } from 'zod'
import { AppError } from '../http/errors/AppError'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  RESET_PASSWORD_SECRET: z.string(),
  REDIS_HOST: z.string().optional().default('redis'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format())

  throw new AppError(_env.error.message)
}

export const env = _env.data
