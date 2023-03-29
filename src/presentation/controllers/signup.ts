import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/htpp-helper'
import { MissingParamError } from '../errors/missing-param-error'
import { type Controller } from '../protocols/controller'
import { type EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const param of requiredFields) {
      if (httpRequest.body[param] === undefined) {
        const httpResponse = badRequest(new MissingParamError(param))
        return httpResponse
      }
    }
    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
    if (emailIsValid === false) {
      const httpResponse = badRequest(new InvalidParamError('email'))
      return httpResponse
    }
    return { statusCode: 200, body: 'good ending' }
  }
}
