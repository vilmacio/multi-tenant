import { SaveUserRepository } from '../../data/signup/protocols/save-user-repository'
import { User } from '../../domain/models/user'
import { AddUserModel } from '../../domain/usecases/add-user'
import { MongoHelper } from './helper'

export class UserMongoRepository implements SaveUserRepository {
  async save (addUserModel:AddUserModel):Promise<User> {
    const userCollection = MongoHelper.getCollection('users')
    const result = await userCollection.insertOne(addUserModel)
    const { _id, ...account } = result.ops[0]
    account.id = _id
    return account
  }
}
