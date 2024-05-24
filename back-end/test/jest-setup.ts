import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomInt } from 'crypto'
import 'dotenv/config'
import { Redis } from 'ioredis'

const prisma = new PrismaClient()

process.env.NODE_ENV = 'test'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

function generateUniqueDatabaseURL(dbId: string) {
  const url = 'file:./test.' + dbId + '.db'
  return url.toString()
}

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  db: Number(9),
})

beforeEach(async () => {
  const dbId = randomInt(999999999).toString()

  const databaseURL = generateUniqueDatabaseURL(dbId)

  process.env.TEST_DATABASE_ID = dbId

  process.env.DATABASE_URL = databaseURL

  await redis.flushdb()

  execSync(`export DATABASE_URL=${databaseURL} && npx prisma migrate deploy`)
})

afterEach(async () => {
  execSync(
    `cd prisma && rm -rf test.${process.env.TEST_DATABASE_ID}.db-journal && rm -rf test.${process.env.TEST_DATABASE_ID}.db && cd ..`,
  )

  await prisma.$disconnect()
})

afterAll(async () => {
  await redis.quit()
})
