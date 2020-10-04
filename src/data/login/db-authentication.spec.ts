import { User } from '../../domain/models/user'
import { DbAuthentication } from './db-authentication'
import { Encrypter } from './protocols/encrypter'
import { HashComparer } from './protocols/hash-comparer'
import { LoadByEmailRepository } from './protocols/load-by-email-repository'

const makeEncrypter = () => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string):Promise<string> {
      return 'any_token'
    }
  }
  return new EncrypterStub()
}

const makeHashComparer = () => {
  class HashComparerStub implements HashComparer {
    async compare (hash:string, valueToCompare: string):Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

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
  const encrypterStub = makeEncrypter()
  const hashComparerStub = makeHashComparer()
  const loadByEmailRepositoryStub = makeLoadByEmailRepository()
  const sut = new DbAuthentication(loadByEmailRepositoryStub, hashComparerStub, encrypterStub)
  return {
    sut,
    loadByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub
  }
}

describe('DB Authentication', () => {
  test('Should call LoadByEmailRepository with correct value', async () => {
    const { sut, loadByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadByEmailRepositoryStub, 'loadByEmail')
    await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should return null if LoadByEmailRepository returns null', async () => {
    const { sut, loadByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const token = await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(token).toBeNull()
  })

  test('Should throws if LoadByEmailRepository throws', async () => {
    const { sut, loadByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth({ email: 'any_email', password: 'any_password' })
    await expect(promise).rejects.toThrow()
  })

  test('Should call HashComparer with correct value', async () => {
    const { sut, hashComparerStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(loadByEmailSpy).toHaveBeenCalledWith('hashed_password', 'any_password')
  })

  test('Should returns null if HashComparer returns null', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(null)
    const token = await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(token).toBeNull()
  })

  test('Should throws if HashComparerStub throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth({ email: 'any_email', password: 'any_password' })
    await expect(promise).rejects.toThrow()
  })

  test('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return null if Encrypter returns null', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(null)
    const token = await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(token).toBeNull()
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth({ email: 'any_email', password: 'any_password' })
    await expect(promise).rejects.toThrow()
  })

  test('Should return the token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(token).toBe('any_token')
  })
})
