import { MissingParamError } from '../../errors'
import { type Validation } from '../../protocols/validation'

export class RequiredFieldValidation implements Validation {
  private readonly requiredField: string

  constructor (requiredField: string) {
    this.requiredField = requiredField
  }

  validate (input: any): Error {
    if (input[this.requiredField] === undefined) return new MissingParamError(this.requiredField)
  }
}
