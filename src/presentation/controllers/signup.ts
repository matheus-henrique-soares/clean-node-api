import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/htpp-helper'
import { MissingParamError } from '../errors/missing-param-error'

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']
    for (const param of requiredFields) {
      if (httpRequest.body[param] === undefined) {
        const httpResponse = badRequest(new MissingParamError(param))
        return httpResponse
      }
    }
    return { statusCode: 400, body: 'end' }
  }
}
