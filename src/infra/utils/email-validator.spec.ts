import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator'

jest.mock('validator', () => {
  return {
    isEmail (email: string):boolean {
      return true
    }
  }
})

describe('Email Validator Adapter', () => {
  test('Should call Validator with correct value', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_email')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should return true if Validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('any_email')
    expect(isValid).toBe(true)
  })

  test('Should return false if Validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('any_email')
    expect(isValid).toBe(false)
  })
})
