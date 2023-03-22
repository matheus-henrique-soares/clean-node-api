import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/htpp-helper'
import { MissingParamError } from '../errors/missing-param-error'
import { type Controller } from '../protocols/controller'

export class SignupController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const param of requiredFields) {
      if (httpRequest.body[param] === undefined) {
        const httpResponse = badRequest(new MissingParamError(param))
        return httpResponse
      }
    }
    return { statusCode: 400, body: 'end' }
  }
}
