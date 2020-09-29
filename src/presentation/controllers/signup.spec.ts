import { EmailValidator } from '../protocols/email-validator'
import { httpRequest, httpResponse } from '../protocols/http'
import { SignUpController } from './signup'

const makeEmailValidator = ():EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = ():SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  describe('Bad Requests', () => {
    test('Should return 400 if name is not provided', async () => {
      const { sut } = makeSut()
      const httpRequest: httpRequest = {
        body: {
          email: 'any_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse: httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new Error('MissingParamError: name'))
    })

    test('Should return 400 if email is not provided', async () => {
      const { sut } = makeSut()
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse: httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new Error('MissingParamError: email'))
    })

    test('Should return 400 if password is not provided', async () => {
      const { sut } = makeSut()
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email'
        }
      }
      const httpResponse: httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new Error('MissingParamError: password'))
    })

    test('Should return 400 if passwordConfirmation is not provided', async () => {
      const { sut } = makeSut()
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          password: 'any_password'
        }
      }
      const httpResponse: httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new Error('MissingParamError: passwordConfirmation'))
    })

    test('Should return 400 if password and passwordConfirmation do not match', async () => {
      const { sut } = makeSut()
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
          passwordConfirmation: 'different_password'
        }
      }
      const httpResponse: httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new Error('InvalidParamError: password'))
    })
  })
})
