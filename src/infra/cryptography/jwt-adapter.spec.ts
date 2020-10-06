import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => {
  return {
    async sign ():Promise<string> {
      return 'access_token'
    }
  }
})

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should return a access_token on success', async () => {
    const sut = new JwtAdapter()
    const token = await sut.encrypt('any_id')
    expect(token).toBe('access_token')
  })

  test('Should throw if JWT fails', async () => {
    const sut = new JwtAdapter()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
