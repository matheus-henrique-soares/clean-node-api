import { badRequest, serverError, ok } from '../../helpers/http/htpp-helper'
import { type HttpRequest, type HttpResponse, type Controller, type AddAccount } from './signup-controller-protocols'
import { type Validation } from '../../protocols/validation'

export class SignupController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { password, email, name } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
