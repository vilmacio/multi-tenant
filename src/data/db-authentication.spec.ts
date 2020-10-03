import { User } from '../domain/models/user'
import { DbAuthentication } from './db-authentication'
import { LoadByEmailRepository } from './protocols/load-by-email-repository'

const makeLoadByEmailRepository = () => {
  class LoadByEmailRepositoryStub implements LoadByEmailRepository {
    async loadByEmail (email: string):Promise<User> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password'
      }
    }
  }
  return new LoadByEmailRepositoryStub()
}

const makeSut = () => {
  const loadByEmailRepositoryStub = makeLoadByEmailRepository()
  const sut = new DbAuthentication(loadByEmailRepositoryStub)
  return {
    sut,
    loadByEmailRepositoryStub
  }
}

describe('DB Authentication', () => {
  test('Should call LoadByEmailRepository with correct value', async () => {
    const { sut, loadByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadByEmailRepositoryStub, 'loadByEmail')
    await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email')
  })
})
