import { badRequest, serverError, ok } from '../helpers/htpp-helper'
import { type EmailValidator, type HttpRequest, type HttpResponse, type Controller } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const param of requiredFields) {
        if (httpRequest.body[param] === undefined) {
          return badRequest(new MissingParamError(param))
        }
      }
      const { password, passwordConfirmation, email } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const emailIsValid = this.emailValidator.isValid(email)
      if (emailIsValid === false) {
        return badRequest(new InvalidParamError('email'))
      }
      return ok('good ending')
    } catch (error) {
      return serverError()
    }
  }
}
