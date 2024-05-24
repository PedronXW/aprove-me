import { CacheRepository } from '@/domain/application/cache/cache-repository'

export class InMemoryCacheRepository implements CacheRepository {
  private cache: Record<string, string> = {}

  async set(key: string, value: string): Promise<void> {
    this.cache[key] = value
  }

  async get(key: string): Promise<string | null> {
    return this.cache[key] ?? null
  }

  async delete(key: string): Promise<void> {
    delete this.cache[key]
  }
}
