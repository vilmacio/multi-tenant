import { User } from '../../domain/models/user'
import { AddUserModel } from '../../domain/usecases/add-user'
import { DbAddUser } from './db-add-user'
import { Hasher } from './protocols/hasher'
import { SaveUserRepository } from './protocols/save-user-repository'

const makeSaveUserRepository = () => {
  class SaveUserRepositoryStub implements SaveUserRepository {
    async save (addUserModel:AddUserModel):Promise<User> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password'
      }
    }
  }
  return new SaveUserRepositoryStub()
}

const makeHasher = () => {
  class HasherStub implements Hasher {
    async hash (value:string):Promise<string> {
      return 'hashed_password'
    }
  }
  return new HasherStub()
}

const makeSut = () => {
  const saveUserRepositoryStub = makeSaveUserRepository()
  const hasherStub = makeHasher()
  const sut = new DbAddUser(hasherStub, saveUserRepositoryStub)
  return {
    sut,
    hasherStub,
    saveUserRepositoryStub
  }
}

const mockAddUserModel:AddUserModel = {
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
}

describe('Add User', () => {
  test('Should call Hasher with correct value', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAddUserModel)
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(mockAddUserModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddUserRepository with correct values', async () => {
    const { sut, saveUserRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveUserRepositoryStub, 'save')
    await sut.add(mockAddUserModel)
    expect(saveSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password'
    })
  })

  test('Should throws if SaveUserRepository throws', async () => {
    const { sut, saveUserRepositoryStub } = makeSut()
    jest.spyOn(saveUserRepositoryStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(mockAddUserModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should return a user on success', async () => {
    const { sut } = makeSut()
    const user = await sut.add(mockAddUserModel)
    expect(user).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password'
    })
  })
})
