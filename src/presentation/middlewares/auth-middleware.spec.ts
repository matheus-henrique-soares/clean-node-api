import { type HttpRequest } from '../protocols'
import { forbidden } from '../helpers/http/htpp-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware.', () => {
  test('shoul retrun 403 if no x-accesss-token exist in headers.', async () => {
    const sut = new AuthMiddleware()
    const httpRequest: HttpRequest = {
      headers: {}
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
