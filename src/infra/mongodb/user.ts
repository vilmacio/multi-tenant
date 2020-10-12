import { ObjectId } from 'mongodb'
import { LoadByIdRepository } from '../../data/authorization/protocols/load-by-id-repository'
import { LoadByEmailRepository } from '../../data/login/protocols/load-by-email-repository'
import { SaveUserRepository } from '../../data/signup/protocols/save-user-repository'
import { User } from '../../domain/models/user'
import { AddUserModel } from '../../domain/usecases/add-user'
import { MongoHelper } from './helper'

export class UserMongoRepository implements SaveUserRepository, LoadByEmailRepository, LoadByIdRepository {
  async save (addUserModel:AddUserModel):Promise<User> {
    const userCollection = MongoHelper.getCollection('users')
    const result = await userCollection.insertOne(addUserModel)
    const { _id, ...account } = result.ops[0]
    account.id = _id
    return account
  }

  async loadByEmail (email:string):Promise<User> {
    const userCollection = MongoHelper.getCollection('users')
    const result = await userCollection.findOne({ email })
    const { _id, ...account } = result
    account.id = _id
    return account
  }

  async loadById (id:string):Promise<User> {
    const userCollection = MongoHelper.getCollection('users')
    const result = await userCollection.findOne({ _id: new ObjectId(id) })
    const { _id, ...account } = result
    account.id = _id
    return account
  }
}
