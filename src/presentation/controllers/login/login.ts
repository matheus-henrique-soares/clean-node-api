import { type Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/htpp-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'
import { type EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const param of requiredFields) {
        if (httpRequest.body[param] === undefined) {
          return badRequest(new MissingParamError(param))
        }
      }
      const { email, password } = httpRequest.body
      const emailIsValid = this.emailValidator.isValid(email)
      if (emailIsValid === false) {
        return badRequest(new InvalidParamError('email'))
      }
      const accessToken = await this.authentication.auth(email, password)
      if (accessToken === null) {
        return unauthorized()
      }
      return ok(httpRequest.body)
    } catch (error) {
      return serverError(error)
    }
  }
}
