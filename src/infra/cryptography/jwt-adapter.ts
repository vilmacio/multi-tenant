import { Encrypter } from '../../data/login/protocols/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  async encrypt (id: string):Promise<string> {
    const token = jwt.sign({ id: id }, 'secret')
    return token
  }
}
