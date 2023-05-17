import { type Controller, type Authentication, type HttpRequest, type HttpResponse } from './login-protocols'
import { badRequest, unauthorized, ok, serverError } from '../../helpers/http/htpp-helper'
import { type Validation } from '../../helpers/validators/validation'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth(email, password)
      if (accessToken === null) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
