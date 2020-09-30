import { InvalidParamError } from '../errors/invalid-param'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, ok, serverError } from '../helpers/http-helper'
import { Authentication } from '../protocols/authentication'
import { EmailValidator } from '../protocols/email-validator'
import { httpRequest } from '../protocols/http'
import { LoginController } from './login'

const makeAuthentication = () => {
  class AuthenticationStub implements Authentication {
    async auth (email:string, password:string):Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = () => {
  const authenticationStub = makeAuthentication()
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

const fakeRequest:httpRequest = {
  body: {
    email: 'any_mail',
    password: 'any_password'
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

  test('Should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(fakeRequest)
    expect(isValidSpy).toHaveBeenCalledWith(fakeRequest.body.email)
  })

  test('Should return 400 if EmailValidator return false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error('any_error') })
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should call EmailValidator with correct value', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(fakeRequest)
    expect(authSpy).toHaveBeenCalledWith(fakeRequest.body.email, fakeRequest.body.password)
  })

  test('Should return token if Authentication returns token', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(ok({ access_token: 'any_token' }))
  })
})
