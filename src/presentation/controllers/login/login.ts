import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/htpp-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'
import { type EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const param of requiredFields) {
        if (httpRequest.body[param] === undefined) {
          return badRequest(new MissingParamError(param))
        }
      }
      const { email } = httpRequest.body
      const emailIsValid = this.emailValidator.isValid(email)
      if (emailIsValid === false) {
        return badRequest(new InvalidParamError('email'))
      }
      return ok(httpRequest.body)
    } catch (error) {
      return serverError(error)
    }
  }
}
