import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

// aqui estamos garantindo que o retorno do validator sera true independente do que passemos para ele
jest.mock('validator', () => {
  return {
    isEmail (): boolean {
      return true
    }
  }
})

describe('EmailValidator adpater', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })
  test('Should call EmailValidatorAdapter.isValid with correct value', () => {
    const sut = new EmailValidatorAdapter()
    const isValidSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_email@email.com')
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
