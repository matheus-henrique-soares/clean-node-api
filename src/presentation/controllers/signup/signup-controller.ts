import { badRequest, serverError, ok } from '../../helpers/http/htpp-helper'
import { type HttpRequest, type HttpResponse, type Controller, type AddAccount, type Authentication } from './signup-controller-protocols'
import { type Validation } from '../../protocols/validation'

export class SignupController implements Controller {
  constructor (private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { password, email, name } = httpRequest.body
      await this.addAccount.add({ name, email, password })
      const accessToken = await this.authentication.auth({ email, password })
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
