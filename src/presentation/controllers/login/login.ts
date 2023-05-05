import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/htpp-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const param of requiredFields) {
      if (httpRequest.body[param] === undefined) {
        return badRequest(new MissingParamError(param))
      }
    }
    return ok(httpRequest.body)
  }
}
