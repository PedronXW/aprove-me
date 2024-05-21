import {
  Encrypter as EncryptInterface,
  IPayload,
} from '@/domain/application/criptography/encrypter'
import { sign, verify } from 'jsonwebtoken'
import { env } from '../env'

export class Encrypter implements EncryptInterface {
  async encrypt(
    payload: Record<string, unknown>,
    factor: string = env.JWT_SECRET,
  ): Promise<string> {
    return sign(payload, factor, {
      expiresIn: 60 * 60, // 1 hour
    })
  }

  async decrypt(
    token: string,
    factor: string = env.JWT_SECRET,
  ): Promise<IPayload> {
    const { id, type } = verify(token, factor) as IPayload
    return { id, type }
  }
}
