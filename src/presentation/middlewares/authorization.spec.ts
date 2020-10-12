import { httpRequest, httpResponse } from '../protocols/http'
import { AuthorizationMiddleware } from './authorization'
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { Authorization } from '../../domain/usecases/authorize-user'
import { User } from '../../domain/models/user'

const makeAuthorization = () => {
  class AuthorizationStub implements Authorization {
    async authorize (accessToken:string, role?:string):Promise<User> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'email',
        password: 'password'
      }
    }
  }

  return new AuthorizationStub()
}

const makeSut = () => {
  const authorizationStub = makeAuthorization()
  const sut = new AuthorizationMiddleware(authorizationStub)
  return {
    sut,
    authorizationStub
  }
}

const fakeRequest:httpRequest = {
  body: {},
  headers: {
    'x-access-token': 'any_token'
  }
}

describe('Authorization Middleware', () => {
  test('Should return 403 if x-access-token is not provided', async () => {
    const { sut } = makeSut()
    const httResponse:httpResponse = await sut.handle({ body: {}, headers: {} })
    expect(httResponse).toEqual(forbidden())
  })

  test('Should call authorization with correct value', async () => {
    const { sut, authorizationStub } = makeSut()
    const authorizeSpy = jest.spyOn(authorizationStub, 'authorize')
    await sut.handle(fakeRequest)
    expect(authorizeSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 403 if authorization returns null', async () => {
    const { sut, authorizationStub } = makeSut()
    jest.spyOn(authorizationStub, 'authorize').mockReturnValueOnce(null)
    const httResponse = await sut.handle(fakeRequest)
    expect(httResponse).toEqual(forbidden())
  })

  test('Should return 200 if authorization returns a user', async () => {
    const { sut } = makeSut()
    const httResponse = await sut.handle(fakeRequest)
    expect(httResponse).toEqual(ok({
      id: 'any_id',
      name: 'any_name',
      email: 'email',
      password: 'password'
    }))
  })

  test('Should return 500 if authorization throws', async () => {
    const { sut, authorizationStub } = makeSut()
    jest.spyOn(authorizationStub, 'authorize').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
