import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { httpRequest } from '../protocols/http'
import { LoginController } from './login'

const makeSut = () => {
  const sut = new LoginController()
  return {
    sut
  }
}

describe('Login Controller', () => {
  test('Should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest: httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httResponse = await sut.handle(httpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest: httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httResponse = await sut.handle(httpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
