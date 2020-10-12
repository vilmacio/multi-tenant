import { DbAuthorization } from '../../data/authorization/db-authorization'
import { JwtAdapter } from '../../infra/cryptography/jwt-adapter'
import { AuthorizationMiddleware } from '../../presentation/middlewares/authorization'

export const authorizationMiddleware = () => {
  const decrypter = new JwtAdapter()
  const authorization = new DbAuthorization(decrypter)
  return new AuthorizationMiddleware(authorization)
}
