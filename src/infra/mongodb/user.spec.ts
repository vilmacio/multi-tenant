import { AddUserModel } from '../../domain/usecases/add-user'
import { MongoHelper } from './helper'
import { UserMongoRepository } from './user'

const makeSut = () => {
  return new UserMongoRepository()
}

describe('User', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URI)
  })

  afterAll(async () => {
    await MongoHelper.desconnect()
  })

  beforeEach(async () => {
    const userCollection = MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should return a user on success', async () => {
      const sut = makeSut()
      const addUserModel:AddUserModel = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      const user = await sut.save(addUserModel)
      expect(user).toBeTruthy()
      expect(user.id).toBeTruthy()
      expect(user.name).toBe(addUserModel.name)
      expect(user.email).toBe(addUserModel.email)
      expect(user.password).toBe(addUserModel.password)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return a user on success', async () => {
      const sut = makeSut()
      const addUserModel:AddUserModel = {
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password'
      }
      const savedUser = await sut.save(addUserModel)
      const user = await sut.loadByEmail(savedUser.email)
      expect(user).toBeTruthy()
      expect(user.id).toBeTruthy()
      expect(user.name).toBe(addUserModel.name)
      expect(user.email).toBe(addUserModel.email)
      expect(user.password).toBe(addUserModel.password)
    })
  })
})
