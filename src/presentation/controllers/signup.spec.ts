import { User } from '../../domain/models/user'
import { AddUser, AddUserModel } from '../../domain/usecases/add-user'
import { InvalidParamError } from '../errors/invalid-param'
import { MissingParamError } from '../errors/missing-param-error'
import { ServerError } from '../errors/server-error'
import { serverError } from '../helpers/http-helper'
import { EmailValidator } from '../protocols/email-validator'
import { httpRequest, httpResponse } from '../protocols/http'
import { SignUpController } from './signup'

const makeAddUser = ():AddUser => {
  class AddUserStub implements AddUser {
    async add (addUserModel:AddUserModel):Promise<User> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
  }
  return new AddUserStub()
}

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
  addUserStub: AddUser
}

const makeSut = ():SutTypes => {
  const addUserStub = makeAddUser()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub, addUserStub)
  return {
    sut,
    emailValidatorStub,
    addUserStub
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
      expect(httpResponse.body).toEqual(new MissingParamError('name'))
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
      expect(httpResponse.body).toEqual(new MissingParamError('email'))
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
      expect(httpResponse.body).toEqual(new MissingParamError('password'))
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
      expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
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
      expect(httpResponse.body).toEqual(new InvalidParamError('password'))
    })

    test('Should call emailValidator with correct value', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      await sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('any_email')
    })

    test('Should return 400 if email is invalid', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should return 500 if EmailValidation throws', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        const error = new Error('any_error')
        error.stack = 'any_stack'
        throw error
      })
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError('Internal Server Error'))
      expect(httpResponse.body.stack).toEqual('any_stack')
    })

    test('Should call AddUser with correct values', async () => {
      const { sut, addUserStub } = makeSut()
      const addSpy = jest.spyOn(addUserStub, 'add')
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      await sut.handle(httpRequest)
      expect(addSpy).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })
    })

    test('Should return 500 if AddUser throws', async () => {
      const { sut, addUserStub } = makeSut()
      const error = new Error()
      error.stack = 'any_stack'
      jest.spyOn(addUserStub, 'add').mockImplementationOnce(() => {
        throw error
      })
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const response = await sut.handle(httpRequest)
      expect(response).toEqual(serverError(error))
    })

    test('Should return 200 on success', async () => {
      const { sut } = makeSut()
      const httpRequest: httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
    })
  })
})
