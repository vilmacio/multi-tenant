import { Decrypter } from './protocols/decrypter'
import { DbAuthorization } from './db-authorization'

const makeDecrypter = () => {
  class DecrypterStub implements Decrypter {
    decrypt (token: string):string {
      return 'any'
    }
  }
  return new DecrypterStub()
}

const makeSut = () => {
  const decryberStub = makeDecrypter()
  const sut = new DbAuthorization(decryberStub)
  return {
    sut,
    decryberStub
  }
}

describe('Authorization Use Case', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decryberStub } = makeSut()
    const decryptSpy = jest.spyOn(decryberStub, 'decrypt')
    await sut.authorize('access_token')
    expect(decryptSpy).toHaveBeenCalledWith('access_token')
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decryberStub } = makeSut()
    jest.spyOn(decryberStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.authorize('access_token')
    expect(httpResponse).toBeNull()
  })
})
