import { type Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return { sut, validationStubs }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails.', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({ field: 'any' })
    expect(error).toEqual(new Error())
  })
  test('Should return the first error if more than one fails.', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error('error 1'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error('error 2'))
    const error = sut.validate({ field: 'any' })
    expect(error).toEqual(new Error('error 1'))
  })
  test('Should not return an error if validation succeds.', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any' })
    expect(error).toBeFalsy()
  })
})
