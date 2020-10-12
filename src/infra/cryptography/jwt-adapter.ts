import { Encrypter } from '../../data/login/protocols/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../data/authorization/protocols/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  async encrypt (id: string):Promise<string> {
    const token = jwt.sign({ id: id }, 'secret')
    return token
  }

  decrypt (token:string):any {
    let payload: any
    try {
      payload = jwt.verify(token, 'secret')
      return payload
    } catch (error) {
      return null
    }
  }
}
