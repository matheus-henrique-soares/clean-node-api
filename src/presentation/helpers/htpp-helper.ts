import { ServerError } from '../errors'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { type HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => {
  return {
    body: error,
    statusCode: 400
  }
}

export const unauthorized = (): HttpResponse => {
  return {
    body: new UnauthorizedError(),
    statusCode: 401
  }
}

export const serverError = (error: Error): HttpResponse => {
  return {
    body: new ServerError(error.stack),
    statusCode: 500
  }
}

export const ok = (data: any): HttpResponse => {
  return {
    body: data,
    statusCode: 200
  }
}
