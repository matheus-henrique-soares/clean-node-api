import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest
    const { name, email } = body
    if (name === undefined) {
      return {
        body: new MissingParamError('name'),
        statusCode: 400
      }
    }
    if (email === undefined) {
      return {
        body: new MissingParamError('email'),
        statusCode: 400
      }
    }
    return { statusCode: 400, body: '' }
  }
}
