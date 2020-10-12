import { User } from '../../domain/models/user'
import { Authorization } from '../../domain/usecases/authorize-user'
import { Decrypter } from './protocols/decrypter'
import { LoadByIdRepository } from './protocols/load-by-id-repository'

export class DbAuthorization implements Authorization {
    private decrypter:Decrypter
    private loadByIdRepository:LoadByIdRepository

    constructor (decrypter:Decrypter, loadByIdRepository:LoadByIdRepository) {
      this.decrypter = decrypter
      this.loadByIdRepository = loadByIdRepository
    }

    async authorize (accessToken:string, role?:string):Promise<User> {
      let payload:any
      try {
        payload = this.decrypter.decrypt(accessToken)
      } catch (error) {
        return null
      }
      if (payload?.id) {
        const user = await this.loadByIdRepository.loadById(payload.id)
        return user
      }
      return null
    }
}
