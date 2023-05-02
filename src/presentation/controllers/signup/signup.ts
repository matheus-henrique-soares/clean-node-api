import { badRequest, serverError, ok } from '../../helpers/htpp-helper'
import { type EmailValidator, type HttpRequest, type HttpResponse, type Controller, type AddAccount } from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const param of requiredFields) {
        if (httpRequest.body[param] === undefined) {
          return badRequest(new MissingParamError(param))
        }
      }
      const { password, passwordConfirmation, email, name } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const emailIsValid = this.emailValidator.isValid(email)
      if (emailIsValid === false) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
