import app from '../app'
import request from 'supertest'
import { MongoHelper } from '../../infra/mongodb/helper'
import env from '../../../env'

describe('Sign Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.desconnect()
  })

  beforeEach(async () => {
    const userCollection = MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on success', async () => {
      const accountData = {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
      await request(app).post('/signup')
        .send(accountData)
        .expect(200)
    })
  })
})
