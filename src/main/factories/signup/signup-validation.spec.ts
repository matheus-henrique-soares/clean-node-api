import { type Validation } from '../../../presentation/protocols/validation'
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../../presentation/utils/email-validator-adapter'
import { makeSignupValidation } from './signup-validations'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('SignupValidation factory', () => {
  test('Shoul call with all validations.', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
