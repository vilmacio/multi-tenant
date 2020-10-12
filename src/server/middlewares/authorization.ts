import { DbAuthorization } from '../../data/authorization/db-authorization'
import { JwtAdapter } from '../../infra/cryptography/jwt-adapter'
import { UserMongoRepository } from '../../infra/mongodb/user'
import { AuthorizationMiddleware } from '../../presentation/middlewares/authorization'

export const authorizationMiddleware = () => {
  const loadByEmailRepository = new UserMongoRepository()
  const decrypter = new JwtAdapter()
  const authorization = new DbAuthorization(decrypter, loadByEmailRepository)
  return new AuthorizationMiddleware(authorization)
}
