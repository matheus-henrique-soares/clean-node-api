import { type Controller, type Authentication, type HttpRequest, type HttpResponse } from './login-controller-protocols'
import { badRequest, unauthorized, ok, serverError } from '../../helpers/http/htpp-helper'
import { type Validation } from '../../protocols'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication, private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })
      if (accessToken === null) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
