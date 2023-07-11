import { MissingParamError } from '../../presentation/errors'
import { type Validation } from '../../presentation/protocols'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly requiredField: string) {}

  validate (input: any): Error {
    if (input[this.requiredField] === undefined) return new MissingParamError(this.requiredField)
  }
}
