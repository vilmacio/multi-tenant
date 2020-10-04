import { User } from '../../domain/models/user'
import { AddUser, AddUserModel } from '../../domain/usecases/add-user'
import { Hasher } from './protocols/hasher'
import { SaveUserRepository } from './protocols/save-user-repository'

export class DbAddUser implements AddUser {
  private hasher:Hasher
  private saveUserRepository:SaveUserRepository

  constructor (hasher:Hasher, saveUserRepository:SaveUserRepository) {
    this.hasher = hasher
    this.saveUserRepository = saveUserRepository
  }

  async add (userData: AddUserModel):Promise<User> {
    const hashedPassword = await this.hasher.hash(userData.password)
    const userDataToSave = userData
    userDataToSave.password = hashedPassword
    const userAccount = await this.saveUserRepository.save(userDataToSave)
    return userAccount
  }
}
