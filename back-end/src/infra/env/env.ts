import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string().optional().default('redis'),
  EMAIL_USERNAME: z.string(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_HOST: z.string(),
  REDIS_PORT: z.coerce.number().optional().default(6379),
})

export type Env = z.infer<typeof envSchema>
