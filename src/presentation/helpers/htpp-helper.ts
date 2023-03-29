import { ServerError } from '../errors'
import { type HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => {
  return {
    body: error,
    statusCode: 400
  }
}

export const serverError = (): HttpResponse => {
  return {
    body: new ServerError(),
    statusCode: 500
  }
}

export const ok = (body): HttpResponse => {
  return {
    body,
    statusCode: 200
  }
}
