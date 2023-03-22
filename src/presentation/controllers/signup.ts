import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/htpp-helper'
import { MissingParamError } from '../errors/missing-param-error'

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest
    const { name, email } = body
    if (name === undefined) {
      const httpResponse = badRequest(new MissingParamError('name'))
      return httpResponse
    }
    if (email === undefined) {
      const httpResponse = badRequest(new MissingParamError('email'))
      return httpResponse
    }
    return { statusCode: 400, body: '' }
  }
}
