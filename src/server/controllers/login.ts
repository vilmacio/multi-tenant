import { DbAuthentication } from '../../data/login/db-authentication'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '../../infra/cryptography/jwt-adapter'
import { UserMongoRepository } from '../../infra/mongodb/user'
import { EmailValidatorAdapter } from '../../infra/utils/email-validator'
import { LoginController } from '../../presentation/controllers/login'

export const loginController = () => {
  const salt = 12
  const encrypter = new JwtAdapter()
  const hashComparer = new BCryptAdapter(salt)
  const loadByEmailRepository = new UserMongoRepository()
  const authentication = new DbAuthentication(loadByEmailRepository, hashComparer, encrypter)
  const emailValidator = new EmailValidatorAdapter()
  return new LoginController(emailValidator, authentication)
}
