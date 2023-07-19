import { type Decrypter, type Encrypter } from '../../../data/protocols/criptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return await new Promise(resolve => { resolve(accessToken) })
  }

  async decrypt (token: string): Promise<string> {
    jwt.verify(token, this.secret)
    return await new Promise(resolve => { resolve(null) })
  }
}
