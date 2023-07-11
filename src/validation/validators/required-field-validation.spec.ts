import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}

describe('RequiredField validation', () => {
  test('Should return a missing param error if validation fails.', () => {
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('any_field'))
  })
  test('Should not return an error if validation succeds.', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any' })
    expect(error).toBeFalsy()
  })
})
