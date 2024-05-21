import { UserTypes } from '@/domain/enterprise/entities/user';

export type IPayload = { id: string; type: UserTypes }

export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    factor?: string,
  ): Promise<string>

  abstract decrypt(token: string, factor?: string): Promise<IPayload>
}
