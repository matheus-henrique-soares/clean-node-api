import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest
    const { name, email } = body
    if (name === undefined) {
      return {
        body: new Error('Missing param: name.'),
        statusCode: 400
      }
    }
    if (email === undefined) {
      return {
        body: new Error('Missing param: email.'),
        statusCode: 400
      }
    }
    return { statusCode: 400, body: '' }
  }
}
