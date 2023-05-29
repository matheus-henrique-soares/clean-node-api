import { MissingParamError } from '../../errors'
import { type Validation } from '../../protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly requiredField: string) {}

  validate (input: any): Error {
    if (input[this.requiredField] === undefined) return new MissingParamError(this.requiredField)
  }
}
