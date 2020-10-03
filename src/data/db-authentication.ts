import { AuthCredentials, Authentication } from '../domain/usecases/auth-user'
import { LoadByEmailRepository } from './protocols/load-by-email-repository'

export class DbAuthentication implements Authentication {
    private loadByEmailRepository:LoadByEmailRepository

    constructor (loadByEmailRepository: LoadByEmailRepository) {
      this.loadByEmailRepository = loadByEmailRepository
    }

    async auth (credentials: AuthCredentials):Promise<string> {
      await this.loadByEmailRepository.loadByEmail(credentials.email)
      return null
    }
}
