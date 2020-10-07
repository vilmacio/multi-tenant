import app from '../app'
import request from 'supertest'
import { MongoHelper } from '../../infra/mongodb/helper'
import env from '../../../env'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Sign Routes', () => {
  let userCollection:Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.desconnect()
  })

  beforeEach(async () => {
    userCollection = MongoHelper.getCollection('users')
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

  describe('POST /login', () => {
    test('Should return 200 on success', async () => {
      const password = await hash('1234', 12)
      await userCollection.insertOne({
        name: 'any_name',
        email: 'vilmaciomoura@gmail.com',
        password
      })
      const credentials = {
        email: 'vilmaciomoura@gmail.com',
        password: '1234'
      }
      await request(app).post('/login')
        .send(credentials)
        .expect(200)
    })
  })
})
