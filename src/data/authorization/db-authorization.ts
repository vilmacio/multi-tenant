import { Authorization } from '../../domain/usecases/authorize-user'
import { Decrypter } from './protocols/decrypter'

export class DbAuthorization implements Authorization {
    private decrypter:Decrypter

    constructor (decrypter:Decrypter) {
      this.decrypter = decrypter
    }

    async authorize (accessToken:string, role?:string) {
      let payload:any
      try {
        payload = this.decrypter.decrypt(accessToken)
      } catch (error) {
        return null
      }
      if (payload?.id) {
        return payload.id
      }
      return null
    }
}
