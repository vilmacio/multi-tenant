import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => {
  return {
    async sign ():Promise<string> {
      return 'access_token'
    },
    verify ():any {
      return 'payload'
    }
  }
})

describe('JWT Adapter', () => {
  describe('encrypt()', () => {
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

  describe('decrypt', () => {
    test('Should call verify with correct value', () => {
      const sut = new JwtAdapter()
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.decrypt('access_token')
      expect(verifySpy).toHaveBeenCalledWith('access_token', 'secret')
    })

    test('Should return a payload on success', async () => {
      const sut = new JwtAdapter()
      const token = await sut.decrypt('any_token')
      expect(token).toBe('payload')
    })

    test('Should return null if Vetify throw a Error', async () => {
      const sut = new JwtAdapter()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_token')
      expect(promise).toBeNull()
    })
  })
})
