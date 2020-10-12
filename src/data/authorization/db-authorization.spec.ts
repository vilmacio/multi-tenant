import { Decrypter } from './protocols/decrypter'
import { LoadByIdRepository } from './protocols/load-by-id-repository'

import { DbAuthorization } from './db-authorization'
import { User } from '../../domain/models/user'

const makeLoadByIdRepository = () => {
  class LoadByIdRepositoryStub implements LoadByIdRepository {
    async loadById (id: string):Promise<User> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
  }
  return new LoadByIdRepositoryStub()
}

const makeDecrypter = () => {
  class DecrypterStub implements Decrypter {
    decrypt (token: string):any {
      return {
        id: 'any_id'
      }
    }
  }
  return new DecrypterStub()
}

const makeSut = () => {
  const loadByIdRepositoryStub = makeLoadByIdRepository()
  const decryberStub = makeDecrypter()
  const sut = new DbAuthorization(decryberStub, loadByIdRepositoryStub)
  return {
    sut,
    decryberStub,
    loadByIdRepositoryStub
  }
}

describe('Authorization Use Case', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decryberStub } = makeSut()
    const decryptSpy = jest.spyOn(decryberStub, 'decrypt')
    await sut.authorize('access_token')
    expect(decryptSpy).toHaveBeenCalledWith('access_token')
  })

  test('Should return null if Decrypter throws', async () => {
    const { sut, decryberStub } = makeSut()
    jest.spyOn(decryberStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.authorize('access_token')
    expect(httpResponse).toBeNull()
  })

  test('Should call LoadByIdRepository with correct value', async () => {
    const { sut, loadByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadByIdRepositoryStub, 'loadById')
    await sut.authorize('access_token')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return null if LoadByIdRepository returns null', async () => {
    const { sut, loadByIdRepositoryStub } = makeSut()
    jest.spyOn(loadByIdRepositoryStub, 'loadById').mockReturnValueOnce(null)
    const response = await sut.authorize('access_token')
    expect(response).toBeNull()
  })

  test('Should return a user on success', async () => {
    const { sut } = makeSut()
    const user = await sut.authorize('access_token')
    expect(user).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
  })
})
