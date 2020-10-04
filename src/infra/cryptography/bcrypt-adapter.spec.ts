import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => {
  return {
    async hash (value: string, salt: string):Promise<string> {
      return 'hashed_value'
    },
    async compare (hash:string, valueToCompare:string):Promise<boolean> {
      return true
    }
  }
})

const salt = 12
const makeSut = () => {
  const sut:BCryptAdapter = new BCryptAdapter(salt)
  return {
    sut
  }
}

describe('BCrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call BCrypt.hash with correct values', async () => {
      const { sut } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should throw if BCrypt.hash throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })

    test('Should return a hash on success', async () => {
      const { sut } = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hashed_value')
    })
  })

  describe('compare()', () => {
    test('Should return false if BCrypt.comapre returns false', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
      const result = await sut.compare('any_value', 'hashed_value')
      expect(result).toBe(false)
    })

    test('Should return true on success', async () => {
      const { sut } = makeSut()
      const result = await sut.compare('any_value', 'hashed_value')
      expect(result).toBe(true)
    })
  })
})
