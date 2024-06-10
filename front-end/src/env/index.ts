import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  BACKEND_URL: z.string().default('http://localhost:3333/'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format())

  throw new Error(_env.error.message)
}

export const env = _env.data
