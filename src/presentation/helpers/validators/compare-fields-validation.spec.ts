import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fileds-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFields validation', () => {
  test('Should return a invalid param error if validation fails.', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any', fieldToCompare: '' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
  test('Should not return an error if validation succeds.', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any', fieldToCompare: 'any' })
    expect(error).toBeFalsy()
  })
})
