import { AuthCredentials, Authentication } from '../../domain/usecases/auth-user'
import { HashComparer } from './protocols/hash-comparer'
import { LoadByEmailRepository } from './protocols/load-by-email-repository'
import { Encrypter } from './protocols/update-access-token'

export class DbAuthentication implements Authentication {
    private loadByEmailRepository:LoadByEmailRepository
    private hashComparer: HashComparer
    private encrypter: Encrypter

    constructor (
      loadByEmailRepository: LoadByEmailRepository,
      hashComparer: HashComparer,
      encrypter: Encrypter
    ) {
      this.loadByEmailRepository = loadByEmailRepository
      this.hashComparer = hashComparer
      this.encrypter = encrypter
    }

    async auth (credentials: AuthCredentials):Promise<string> {
      const account = await this.loadByEmailRepository.loadByEmail(credentials.email)
      if (account) {
        const isValid = await this.hashComparer.compare(account.password, credentials.password)
        if (isValid) {
          const token = await this.encrypter.encrypt(account.id)
          return token
        }
      }
      return null
    }
}
