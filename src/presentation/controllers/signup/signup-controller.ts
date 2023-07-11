import { badRequest, serverError, ok, forbidden } from '../../helpers/http/htpp-helper'
import { type HttpRequest, type HttpResponse, type Controller, type AddAccount, type Authentication } from './signup-controller-protocols'
import { type Validation } from '../../protocols'
import { EmailInUseError } from '../../errors'

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
      const account = await this.addAccount.add({ name, email, password })
      if (account === null) return forbidden(new EmailInUseError())
      const accessToken = await this.authentication.auth({ email, password })
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
