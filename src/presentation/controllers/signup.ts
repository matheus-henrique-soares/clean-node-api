import { badRequest, serverError, ok } from '../helpers/htpp-helper'
import { type EmailValidator, type HttpRequest, type HttpResponse, type Controller } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { type AddAccount } from '../../domain/usecases/add-account'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
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
      const account = this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
