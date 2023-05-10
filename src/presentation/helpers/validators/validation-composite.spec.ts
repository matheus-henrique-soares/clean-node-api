import { type Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  test('Should return an error if any validation fails.', () => {
    class ValidationStub implements Validation {
      validate (inout: any): Error {
        return new Error()
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any' })
    expect(error).toEqual(new Error())
  })
})
