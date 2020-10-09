import { DbAddUser } from '../../data/signup/db-add-user'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { UserMongoRepository } from '../../infra/mongodb/user'
import { EmailValidatorAdapter } from '../../infra/utils/email-validator'
import { SignUpController } from '../../presentation/controllers/signup'

export const signupController = ():SignUpController => {
  const salt = 12
  const userRepository = new UserMongoRepository()
  const hasher = new BCryptAdapter(salt)
  const addUser = new DbAddUser(hasher, userRepository)
  const emailValidator = new EmailValidatorAdapter()
  return new SignUpController(emailValidator, addUser)
}
