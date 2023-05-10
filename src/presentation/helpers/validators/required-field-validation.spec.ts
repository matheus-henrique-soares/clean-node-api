import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField validation', () => {
  test('Should return a missing param error if validation fails.', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('any_field'))
  })
})
